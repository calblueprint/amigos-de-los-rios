/* eslint-disable @typescript-eslint/no-require-imports */

/*
 * ---------------------------------------------------------------------------
 * Request / Response Schema
 * ---------------------------------------------------------------------------
 *
 * REQUEST BODY (HTTP POST)
 * ------------------------
 * {
 *   hub: {
 *     lat: number,                       // Hub latitude (start/end point for all teams)
 *     lng: number,                       // Hub longitude
 *   },
 *
 *   vehicles: [
 *     {
 *       id: string,                      // Unique vehicle/team identifier e.g. "V-1"
 *       team_type: "A" | "B" | "C" | "D",  // Controls eligibility + water capacity
 *       team_time_budget_minutes: number, // Hard cap on total route duration
 *       team_size: number,               // Number of volunteers on this team (saved to Routes.num_volunteers)
 *     }
 *   ],
 *
 *   properties: [
 *     {
 *       id: string,                      // Unique property identifier e.g. "prop-1"
 *       property_type: "A" | "B" | "C", // A=onsite water, B=hydrant nearby, C=truck required
 *       lat: number,
 *       lng: number,
 *       service_time_minutes: number,    // How long the team spends at this property
 *       water_demand_gallons: number,    // (optional) Water needed; used for truck load tracking
 *       priority_score: number,          // (optional) Higher = optimizer tries harder to include;
 *                                        //            defaults to 1000 if omitted
 *       address: string,                 // (optional) Human-readable address for display
 *     }
 *   ],
 *
 *   hydrants: [                          // (optional) Omit or pass [] if no truck teams
 *     {
 *       id: string,                      // Unique hydrant identifier e.g. "h-1"
 *       lat: number,
 *       lng: number,
 *                                        // Hydrants are connected to city water — no capacity limit.
 *                                        // The truck's tank size (TEAM_WATER_CAPACITY_GALLONS) is
 *                                        // the only relevant constraint.
 *     }
 *   ]
 * }
 *
 * RESPONSE BODY
 * -------------
 * {
 *   routes: [
 *     {
 *       vehicle_id: string,
 *       property_stops: [
 *         {
 *           type: "property",
 *           property_id: string,
 *           address: string,
 *           property_type: "A" | "B" | "C",
 *           lat: number,
 *           lng: number,
 *           service_time_min: number,
 *           water_demand_gallons: number | null,
 *           priority_score: number | null,
 *           arrival_time: string,         // RFC3339 e.g. "2026-03-01T08:34:00Z"
 *         }
 *       ],
 *       hydrant_stops: [
 *         {
 *           type: "hydrant_refill",
 *           hydrant_id: string,
 *           lat: number,
 *           lng: number,
 *           duration_min: number,
 *           arrival_time: string,
 *         }
 *       ],
 *       totals: {
 *         travel_min: number,
 *         service_min: number,
 *         refill_min: number,
 *         total_min: number,
 *       },
 *       maps_url: string | null,          // Google Maps navigation link for this team
 *     }
 *   ],
 *   dropped_properties: [
 *     {
 *       property_id: string,
 *       reason: string,                   // e.g. "Could not fit in time budget"
 *     }
 *   ],
 *   skipped_hydrants: [
 *     { hydrant_id: string }             // Hydrants that weren't needed (informational)
 *   ],
 *   metrics: object | null,              // Raw GCP metrics (total distance, duration, etc.)
 * }
 */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Team type → eligible property types mapping.
 *
 * A: volunteers only           → Type A (onsite water)
 * B: hydrant-trained           → Type A, B
 * C: 500-gal truck             → Type A, B, C
 * D: contractor 2000-gal truck → Type A, B, C
 */
const TEAM_ELIGIBLE_PROPERTY_TYPES = {
  A: ["A"],
  B: ["A", "B"],
  C: ["A", "B", "C"],
  D: ["A", "B", "C"],
};

/**
 * Water capacity (gallons) per team type.
 * Type A/B teams carry no truck water — they use onsite or hydrant sources.
 * We model this as "unlimited" (null) since water isn't a constraint for them.
 */
const TEAM_WATER_CAPACITY_GALLONS = {
  A: null, // no truck — onsite water only
  B: null, // no truck — hydrant water
  C: 500,
  D: 2000,
};

/**
 * Team type code -> Routes.volunteer_type enum value.
 */
const TEAM_TYPE_TO_VOLUNTEER_TYPE = {
  A: "Type A",
  B: "Type B",
  C: "Type C",
  D: "Type D",
  E: "Type E",
};

/**
 * How long (seconds) it takes to refill at a fire hydrant.
 * Truck teams (C/D) need refill stops; volunteer teams don't.
 */
const HYDRANT_REFILL_DURATION_SECONDS = 300; // 5 minutes

const PROPS_PER_TEAM = 15; // how many properties to include per team in the optimization input

/**
 * Defaults used when source data does not provide optimizer-required fields.
 */
const DEFAULT_PROPERTY_SERVICE_TIME_MINUTES = 10;
const DEFAULT_PROPERTY_WATER_DEMAND_GALLONS = 100;
const DEFAULT_PROPERTY_PRIORITY_SCORE = 1000;

/**
 * Creates a Supabase client using the service role key so Lambda can bypass RLS.
 */
function createSupabaseServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Supabase not configured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/**
 * Verifies a Supabase JWT from the Authorization header.
 */
function verifySupabaseToken(authHeader, jwtSecret) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new Error("Token expired");
    throw new Error("Invalid token");
  }
}

// ---------------------------------------------------------------------------
// Google OAuth2
// ---------------------------------------------------------------------------

/**
 * Exchanges a service-account key for a short-lived OAuth2 access token.
 */
async function getAccessToken(serviceAccountKey) {
  const now = Math.floor(Date.now() / 1000);

  // Build the JWT payload (claims) - tells Google who we are and what we want access to
  const claims = {
    iss: serviceAccountKey.client_email, // Who is making the request
    scope: "https://www.googleapis.com/auth/cloud-platform", // What permissions we need
    aud: "https://oauth2.googleapis.com/token", // Who should verify this token
    iat: now, // When token was issued
    exp: now + 3600, // When token expires (valid for 1 hour)
  };

  // JWT header specifies we're using RSA-SHA256 signing algo
  const header = { alg: "RS256", typ: "JWT" };

  // Encode header and claims to base64url format (JWT standard)
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url",
  );
  const encodedClaims = Buffer.from(JSON.stringify(claims)).toString(
    "base64url",
  );

  // Create a crypto signature using our service account's private key
  // Proves to Google we own this service account
  const signatureInput = `${encodedHeader}.${encodedClaims}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signatureInput)
    .sign(serviceAccountKey.private_key, "base64url");

  // Complete JWT format: header.payload.signature
  const signedJwt = `${signatureInput}.${signature}`;

  // Exchange the signed JWT for a short-lived access token
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth2 token exchange failed: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formats timestamps to exclude milliseconds/nanoseconds
 * Route Optimization API strictly requires RFC3339 format with whole seconds only
 */
function formatTimestamp(date) {
  return date.toISOString().split(".")[0] + "Z";
}

/**
 * Generates a Google Maps navigation URL for a single team's ordered stops.
 */
function generateMapsUrl(stops, hub) {
  if (!stops || stops.length === 0) return null;
  const waypoints = stops.map(s => `${s.lat},${s.lng}`).join("|");
  return (
    `https://www.google.com/maps/dir/?api=1&` +
    `origin=${hub.lat},${hub.lng}&` +
    `destination=${hub.lat},${hub.lng}&` +
    `waypoints=${encodeURIComponent(waypoints)}&` +
    `travelmode=driving`
  );
}

/**
 * Maps one Supabase Property row into the optimizer property input shape.
 */
function mapSupabasePropertyToOptimizerProperty(prop) {
  return {
    id: String(prop.id),
    lat: prop.latitude,
    lng: prop.longitude,
    property_type: prop.property_type, // A, B, or C
    service_time_minutes: DEFAULT_PROPERTY_SERVICE_TIME_MINUTES,
    water_demand_gallons: DEFAULT_PROPERTY_WATER_DEMAND_GALLONS,
    priority_score: prop.priority_score ?? 1000, // default priority if not provided
    address: prop.address ?? "Address unknown",
  };
}

/**
 * Persists the generated session, routes, and route stops into Supabase.
 */
async function persistGeneratedRoutesToSupabase({
  sessionName,
  sessionDate,
  routes,
  vehicles,
}) {
  const supabase = createSupabaseServiceClient();
  const vehicleById = Object.fromEntries(
    vehicles.map(vehicle => [vehicle.id, vehicle]),
  );

  const { data: sessionRow, error: sessionError } = await supabase
    .from("Watering Sessions")
    .insert({
      watering_event_name: sessionName,
      date: sessionDate,
      central_hub: "Cemetery",
      central_hub_lat: 34.187457296896646,
      central_hub_long: -118.14996842503949,
    })
    .select("id")
    .single();

  if (sessionError) {
    throw new Error(
      `Failed to create watering session: ${sessionError.message}`,
    );
  }

  let insertedRoutes = [];
  if (routes.length > 0) {
    const routeRows = routes.map(route => {
      const vehicle = vehicleById[route.vehicle_id];
      return {
        watering_event_id: sessionRow.id,
        date: sessionDate,
        watering_event_name: sessionName,
        route_label: route.vehicle_id,
        volunteer_type: TEAM_TYPE_TO_VOLUNTEER_TYPE[vehicle?.team_type] ?? null,
        num_volunteers: vehicle?.team_size ?? null,
        maps_link: route.maps_url ?? null,
      };
    });

    const { data: createdRoutes, error: routesError } = await supabase
      .from("Routes")
      .insert(routeRows)
      .select("id, route_label");

    if (routesError) {
      throw new Error(`Failed to create routes: ${routesError.message}`);
    }

    insertedRoutes = createdRoutes ?? [];
  }

  const routeIdByLabel = Object.fromEntries(
    insertedRoutes.map(routeRow => [routeRow.route_label, routeRow.id]),
  );

  const routeStopRows = [];
  routes.forEach(route => {
    const routeId = routeIdByLabel[route.vehicle_id];
    if (!routeId) {
      return;
    }

    (route.ordered_stops ?? []).forEach((stop, index) => {
      if (stop.type === "hydrant_refill") {
        routeStopRows.push({
          route_id: routeId,
          order_to_visit: index + 1,
          hydrant_id: stop.hydrant_id,
          property_address: stop.address ?? null,
        });
        return;
      }

      routeStopRows.push({
        route_id: routeId,
        order_to_visit: index + 1,
        property_id: stop.property_id,
        property_address: stop.address ?? "Address unknown",
      });
    });
  });

  if (routeStopRows.length > 0) {
    const { error: routeStopsError } = await supabase
      .from("Route Stops")
      .insert(routeStopRows);

    if (routeStopsError) {
      throw new Error(
        `Failed to create route stops: ${routeStopsError.message}`,
      );
    }
  }

  return {
    watering_session_id: sessionRow.id,
    route_count: insertedRoutes?.length ?? 0,
    route_stop_count: routeStopRows.length,
  };
}

/**
 * Fetches properties from Supabase and returns normalized optimizer properties.
 */
async function fetchSupabaseProperties(propertyLimit) {
  const supabase = createSupabaseServiceClient();

  if (!Number.isFinite(propertyLimit) || propertyLimit <= 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("Property")
    .select(
      "id,address,latitude,longitude,water_onsite,property_type,priority_score",
    )
    .order("priority_score", { ascending: false, nullsFirst: false })
    .limit(propertyLimit);

  if (error) {
    throw new Error(
      `Failed to fetch properties from Supabase: ${error.message}`,
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Supabase returned an invalid properties payload");
  }

  return data.map(mapSupabasePropertyToOptimizerProperty);
}

/**
 * Fetches all hydrants from Supabase and maps them to optimizer hydrant shape.
 */
async function fetchSupabaseHydrants() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("Hydrants")
    .select("id,hydrant_address,latitude,longitude");

  if (error) {
    throw new Error(`Failed to fetch hydrants from Supabase: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error("Supabase returned an invalid hydrants payload");
  }

  return data
    .filter(
      hydrant =>
        hydrant?.id && hydrant.latitude != null && hydrant.longitude != null,
    )
    .map(hydrant => ({
      id: String(hydrant.id),
      address: hydrant.hydrant_address ?? null,
      lat: hydrant.latitude,
      lng: hydrant.longitude,
    }));
}

// ---------------------------------------------------------------------------
// Request building
// ---------------------------------------------------------------------------

/**
 * Builds the full Google Route Optimization API request body.
 *
 * GCP's Route Optimization API was designed for delivery companies, so it uses
 * shipping/logistics terminology throughout. In ADLR's context:
 *
 *   "shipment" = a tree watering visit at a property
 *   "delivery" = the visit itself — where it happens and how long it takes
 *   "pickup" = used for hydrant refills, where the truck loads water
 *   "vehicle" = any team in the field. Defines where the team starts/ends, time window, and water capacity
 *   "label" = a unique string identifier on a shipment or vehicle
 *   "penaltyCost" = the cost the optimizer pays for skipping a shipment
 *   "loadDemands" = how much of a resource a shipment consumes (negative) or restores (positive).
 *                   "water_gallons" represents how much water each property needs and each hydrant provides
 *   "loadLimits" = the maximum load a vehicle can carry for a given resource. Set "water_gallons" to water capacity of types C and D
 *   "timeWindows" = the earliest and latest a property can be visited
 *
 * This vocabulary is a GCP internal detail and never surfaces in our input or output.
 *
 * ---------------------------------------------------------------------------
 *
 * Key design decisions reflected here:
 *
 * 1. 3 calls to GCP:
 *    In the first call, only properties of Type A and vehicle of Type A are included.
 *    In the second call, properties of Type B as well as properties dropped in call 1 are included,
 *    along with vehicles of Type B.
 *    In the third call, properties of Type C as well as properties dropped in call 3 are included,
 *    along with vehicles of Type C and D.
 *    These 3 calls allow for Type A properties to be prioritized by Type A vehicles,
 *    Type B by Type B vehicles, etc.
 *
 * 2. Priority / penalty_cost: higher-priority properties (not visited
 *    recently, more trees, etc.) carry a larger penalty_cost. The optimizer
 *    treats skipping a stop as incurring that cost, so it works hard to include
 *    high-penalty stops before lower-priority ones.
 *
 * 3. Water demand & load limits: each property declares a `water` demand
 *    (gallons). Truck vehicles (C/D) are given a `loadLimits.water.maxLoad`
 *    matching their tank capacity. The optimizer will automatically schedule
 *    hydrant refill stops when a truck's water would run out.
 *
 * 4. Hydrant refill shipments: hydrants are modeled as optional "pickup"
 *    shipments with zero penalty (no cost to skip) but a positive water demand
 *    (they refill the tank). They are only offered to truck vehicles.
 */
function buildOptimizationRequest(
  hub,
  properties,
  vehiclesInput,
  hydrants,
  now,
) {
  const globalEndTime = new Date(
    Math.max(
      ...vehiclesInput.map(
        v => now.getTime() + v.team_time_budget_minutes * 60000,
      ),
    ),
  );

  // Vehicles
  const vehicles = vehiclesInput.map(v => {
    const vehicleEndTime = new Date(
      now.getTime() + v.team_time_budget_minutes * 60000,
    );
    const waterCapacity = TEAM_WATER_CAPACITY_GALLONS[v.team_type];

    const vehicleDef = {
      label: v.id,
      startLocation: { latitude: hub.lat, longitude: hub.lng },
      endLocation: { latitude: hub.lat, longitude: hub.lng },
      startTimeWindows: [
        {
          startTime: formatTimestamp(now),
          endTime: formatTimestamp(vehicleEndTime),
        },
      ],
      endTimeWindows: [
        {
          startTime: formatTimestamp(now),
          endTime: formatTimestamp(vehicleEndTime),
        },
      ],
      costPerHour: 0.01,
    };

    // Only add load limits for truck teams that actually carry water
    if (waterCapacity !== null) {
      vehicleDef.loadLimits = {
        water_gallons: { maxLoad: String(waterCapacity) },
      };
    }

    return vehicleDef;
  });

  // Property shipments
  // In tiered approach, all vehicles in the call can handle all properties,
  // so we don't need allowedVehicleIndices
  const propertyShipments = properties.map(prop => {
    const shipment = {
      label: prop.id,
      // default penalty cost is 1000 if priority_score is not passed in for a property
      penaltyCost: prop.priority_score ?? 1000,
      deliveries: [
        {
          arrivalLocation: { latitude: prop.lat, longitude: prop.lng },
          duration: `${prop.service_time_minutes * 60}s`,
          timeWindows: [
            {
              startTime: formatTimestamp(now),
              endTime: formatTimestamp(globalEndTime),
            },
          ],
        },
      ],
    };

    // Add water demand for all property types (used by truck load tracking)
    if (prop.water_demand_gallons != null) {
      shipment.deliveries[0].loadDemands = {
        water_gallons: { amount: String(prop.water_demand_gallons) },
      };
    }

    return shipment;
  });

  // Hydrant refill shipments (only included in Call 3 for truck teams)
  const hydrantShipments = [];

  hydrants.forEach(h => {
    hydrantShipments.push({
      label: `hydrant_${h.id}_500gal_v0`,
      penaltyCost: 0,
      pickups: [
        {
          arrivalLocation: { latitude: h.lat, longitude: h.lng },
          duration: `${HYDRANT_REFILL_DURATION_SECONDS}s`,
          loadDemands: {
            water_gallons: {
              amount: String(500),
            },
          },
          timeWindows: [
            {
              startTime: formatTimestamp(now),
              endTime: formatTimestamp(globalEndTime),
            },
          ],
        },
      ],
    });
  });

  return {
    model: {
      shipments: [...propertyShipments, ...hydrantShipments],
      vehicles,
      globalStartTime: formatTimestamp(now),
      globalEndTime: formatTimestamp(globalEndTime),
    },
  };
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

async function callRouteOptimizationApi(requestBody, accessToken, projectId) {
  console.log("GCP request:", JSON.stringify(requestBody, null, 2));

  const res = await fetch(
    `https://routeoptimization.googleapis.com/v1/projects/${projectId}:optimizeTours`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Goog-FieldMask": "routes,skippedShipments,metrics",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.log("GCP error response:", err);
    throw new Error(`Route Optimization API error: ${err}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Response formatting
// ---------------------------------------------------------------------------

/**
 * Transforms the raw GCP response into a frontend-friendly shape.
 *
 * Each route includes:
 *  - Ordered property stops with arrival times and service durations
 *  - Hydrant refill stops clearly labelled (so the frontend can render them differently)
 *  - Travel / service / total time totals
 *  - A Google Maps navigation link
 *
 * Skipped shipments are split into two buckets:
 *  - dropped_properties: properties that couldn't fit in any team's budget
 *  - skipped_hydrants: hydrant refills that weren't needed (informational only)
 */
function formatResponse(optimizationResult, properties, hydrants, hub) {
  const routes = optimizationResult.routes ?? [];
  const propertyById = Object.fromEntries(properties.map(p => [p.id, p]));
  // prefix with hydrant_ to make classifying between properties and hydrants easier later
  const hydrantById = Object.fromEntries(
    hydrants.map(h => [`hydrant_${h.id}`, h]),
  );

  if (routes.length === 0) {
    return {
      routes: [],
      dropped_properties: properties.map(p => ({
        property_id: p.id,
        reason: "Could not fit in time budget",
      })),
      skipped_hydrants: [],
      metrics: optimizationResult.metrics ?? null,
    };
  }

  const formattedRoutes = routes.map(route => {
    const propertyStops = [];
    const hydrantStops = [];
    const orderedStops = [];

    // allStops is built in the same pass for the Maps URL — no second loop needed
    const allStops = [];

    (route.visits ?? []).forEach(visit => {
      const label = visit.shipmentLabel;

      if (label.startsWith("hydrant_")) {
        // Extract base hydrant ID and refill amount
        // Format: hydrant_{id}_{500gal}_v{index}
        const match = label.match(/^hydrant_(.+?)_(\d+)gal_v\d+$/);
        const baseHydrantId = match ? match[1] : label;
        const refillAmount = match ? match[2] : "unknown";

        const hydrantKey = `hydrant_${baseHydrantId}`;
        const hydrant = hydrantById[hydrantKey];

        const stop = {
          type: "hydrant_refill",
          hydrant_id: baseHydrantId,
          lat: hydrant?.lat,
          lng: hydrant?.lng,
          address: hydrant?.address ?? "Address unknown",
          duration_min: HYDRANT_REFILL_DURATION_SECONDS / 60,
          refill_amount_gallons: Number(refillAmount),
          arrival_time: visit.startTime,
        };
        hydrantStops.push(stop);
        orderedStops.push(stop);
        allStops.push({ lat: stop.lat, lng: stop.lng });
      } else {
        // Property stop — guard against unknown labels returned by GCP
        const prop = propertyById[label];
        if (!prop) {
          console.warn(
            `formatResponse: unknown shipment label "${label}" — skipping`,
          );
          return;
        }
        const stop = {
          type: "property",
          property_id: prop.id,
          address: prop.address ?? "Address unknown",
          property_type: prop.property_type,
          lat: prop.lat,
          lng: prop.lng,
          service_time_min: prop.service_time_minutes,
          water_demand_gallons: prop.water_demand_gallons ?? null,
          priority_score: prop.priority_score ?? null,
          arrival_time: visit.startTime,
        };
        propertyStops.push(stop);
        orderedStops.push(stop);
        allStops.push({ lat: stop.lat, lng: stop.lng });
      }
    });

    const totalServiceMin = propertyStops.reduce(
      (sum, s) => sum + s.service_time_min,
      0,
    );
    const totalRefillMin = hydrantStops.reduce(
      (sum, s) => sum + s.duration_min,
      0,
    );
    const totalDurationSec = Number(
      (route.metrics?.totalDuration ?? "0s").replace("s", ""),
    );
    const totalTravelMin = Math.max(
      0,
      Math.round(totalDurationSec / 60 - totalServiceMin - totalRefillMin),
    );

    return {
      vehicle_id: route.vehicleLabel,
      property_stops: propertyStops,
      hydrant_stops: hydrantStops,
      ordered_stops: orderedStops,
      totals: {
        travel_min: totalTravelMin,
        service_min: totalServiceMin,
        refill_min: totalRefillMin,
        total_min: totalTravelMin + totalServiceMin + totalRefillMin,
      },
      maps_url: generateMapsUrl(
        allStops.filter(s => s.lat && s.lng),
        hub,
      ),
    };
  });

  // Split skipped shipments into properties vs hydrants
  const dropped_properties = [];
  const uniqueSkippedHydrantIds = new Set();
  let skipped_hydrants = [];

  (optimizationResult.skippedShipments ?? []).forEach(s => {
    if (s.label.startsWith("hydrant_")) {
      const match = s.label.match(/^hydrant_(.+?)_\d+gal_v\d+$/);
      if (match) {
        uniqueSkippedHydrantIds.add(match[1]);
      }
    } else {
      dropped_properties.push({
        property_id: s.label,
        reason: "Could not fit in time budget",
      });
    }
  });

  skipped_hydrants = Array.from(uniqueSkippedHydrantIds).map(id => ({
    hydrant_id: id,
  }));

  return {
    routes: formattedRoutes,
    dropped_properties,
    skipped_hydrants,
    metrics: optimizationResult.metrics ?? null,
  };
}

// ---------------------------------------------------------------------------
// Three-Call Tiered Optimization
// ---------------------------------------------------------------------------

/**
 * Executes the three-call tiered optimization approach:
 * - Call 1: Team A vehicles + Type A properties
 * - Call 2: Team B vehicles + Type B properties + dropped from Call 1
 * - Call 3: Team C/D vehicles + Type C properties + dropped from Call 2
 */
async function runTieredOptimization(
  hub,
  allProperties,
  allVehicles,
  hydrants,
  accessToken,
  projectId,
  now,
) {
  // Create property lookup map for cascading
  const propertyById = Object.fromEntries(allProperties.map(p => [p.id, p]));

  // Separate properties by type
  const typeAProperties = allProperties.filter(p => p.property_type === "A");
  const typeBProperties = allProperties.filter(p => p.property_type === "B");
  const typeCProperties = allProperties.filter(p => p.property_type === "C");

  // Separate vehicles by team type
  const teamAVehicles = allVehicles.filter(v => v.team_type === "A");
  const teamBVehicles = allVehicles.filter(v => v.team_type === "B");
  const teamCDVehicles = allVehicles.filter(
    v => v.team_type === "C" || v.team_type === "D",
  );

  let allRoutes = [];
  let allSkippedHydrants = [];
  let finalDroppedProperties = [];

  // ---------------------------------------------------------------------------
  // CALL 1: Team A + Type A Properties
  // ---------------------------------------------------------------------------
  let call1DroppedPropertyIds = [];

  if (teamAVehicles.length > 0 && typeAProperties.length > 0) {
    console.log(
      `Call 1: ${teamAVehicles.length} Team A vehicles + ${typeAProperties.length} Type A properties`,
    );

    const call1Request = buildOptimizationRequest(
      hub,
      typeAProperties,
      teamAVehicles,
      [],
      now,
    );
    const call1Result = await callRouteOptimizationApi(
      call1Request,
      accessToken,
      projectId,
    );
    const call1Response = formatResponse(call1Result, typeAProperties, [], hub);

    allRoutes.push(...call1Response.routes);
    call1DroppedPropertyIds = call1Response.dropped_properties.map(
      p => p.property_id,
    );

    console.log(
      `Call 1 completed: ${call1Response.routes.length} routes, ${call1DroppedPropertyIds.length} dropped`,
    );
  } else {
    console.log("Call 1 skipped: no Team A vehicles or Type A properties");
    // If no Team A vehicles, all Type A properties cascade to Call 2
    call1DroppedPropertyIds = typeAProperties.map(p => p.id);
  }

  // ---------------------------------------------------------------------------
  // CALL 2: Team B + Type B Properties + Call 1 Drops
  // ---------------------------------------------------------------------------
  let call2DroppedPropertyIds = [];

  // Gather properties for Call 2
  const call2Properties = [
    ...typeBProperties,
    ...call1DroppedPropertyIds.map(id => propertyById[id]),
  ];

  if (teamBVehicles.length > 0 && call2Properties.length > 0) {
    console.log(
      `Call 2: ${teamBVehicles.length} Team B vehicles + ${call2Properties.length} properties (${typeBProperties.length} Type B + ${call1DroppedPropertyIds.length} from Call 1)`,
    );

    const call2Request = buildOptimizationRequest(
      hub,
      call2Properties,
      teamBVehicles,
      [],
      now,
    );
    const call2Result = await callRouteOptimizationApi(
      call2Request,
      accessToken,
      projectId,
    );
    const call2Response = formatResponse(call2Result, call2Properties, [], hub);

    allRoutes.push(...call2Response.routes);
    call2DroppedPropertyIds = call2Response.dropped_properties.map(
      p => p.property_id,
    );

    console.log(
      `Call 2 completed: ${call2Response.routes.length} routes, ${call2DroppedPropertyIds.length} dropped`,
    );
  } else {
    console.log("Call 2 skipped: no Team B vehicles or properties");
    // If no Team B vehicles, all Call 2 properties cascade to Call 3
    call2DroppedPropertyIds = call2Properties.map(p => p.id);
  }

  // ---------------------------------------------------------------------------
  // CALL 3: Team C/D + Type C Properties + Call 2 Drops
  // ---------------------------------------------------------------------------

  // Gather properties for Call 3
  const call3Properties = [
    ...typeCProperties,
    ...call2DroppedPropertyIds.map(id => propertyById[id]),
  ];

  if (teamCDVehicles.length > 0 && call3Properties.length > 0) {
    console.log(
      `Call 3: ${teamCDVehicles.length} Team C/D vehicles + ${call3Properties.length} properties (${typeCProperties.length} Type C + ${call2DroppedPropertyIds.length} from Call 2)`,
    );

    const call3Request = buildOptimizationRequest(
      hub,
      call3Properties,
      teamCDVehicles,
      hydrants,
      now,
    );
    const call3Result = await callRouteOptimizationApi(
      call3Request,
      accessToken,
      projectId,
    );
    const call3Response = formatResponse(
      call3Result,
      call3Properties,
      hydrants,
      hub,
    );

    allRoutes.push(...call3Response.routes);
    allSkippedHydrants = call3Response.skipped_hydrants;
    finalDroppedProperties = call3Response.dropped_properties;

    console.log(
      `Call 3 completed: ${call3Response.routes.length} routes, ${finalDroppedProperties.length} dropped`,
    );
  } else {
    console.log("Call 3 skipped: no Team C/D vehicles or properties");
    // If Call 3 is skipped, everything in call3Properties becomes final dropped
    finalDroppedProperties = call3Properties.map(p => ({
      property_id: p.id,
      reason: "Could not fit in time budget",
    }));
  }

  // ---------------------------------------------------------------------------
  // Merge and return final response
  // ---------------------------------------------------------------------------

  return {
    routes: allRoutes,
    dropped_properties: finalDroppedProperties,
    skipped_hydrants: allSkippedHydrants,
    metrics: null, // We could aggregate metrics from all three calls if needed
  };
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

function validateInput({ hub, vehicles, properties, hydrants }) {
  if (!hub || hub.lat == null || hub.lng == null) {
    return "Missing or invalid hub (requires lat, lng)";
  }

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return "vehicles[] is required and must be non-empty";
  }

  for (const v of vehicles) {
    if (!v.id) return "Each vehicle must have an id";
    if (!v.team_type || !["A", "B", "C", "D"].includes(v.team_type)) {
      return `Vehicle ${v.id}: team_type must be A, B, C, or D`;
    }
    if (!v.team_time_budget_minutes || v.team_time_budget_minutes <= 0) {
      return `Vehicle ${v.id}: team_time_budget_minutes must be a positive number`;
    }
    if (!Number.isFinite(v.team_size) || v.team_size < 0) {
      return `Vehicle ${v.id}: team_size must be a non-negative number`;
    }
  }

  if (!Array.isArray(properties) || properties.length === 0) {
    return "properties[] is required and must be non-empty";
  }

  if (properties.length > 1000) {
    return "Too many properties (max 1000)";
  }

  for (const p of properties) {
    if (
      !p.id ||
      p.lat == null ||
      p.lng == null ||
      p.service_time_minutes == null
    ) {
      return "Each property must have: id, lat, lng, service_time_minutes";
    }
    if (!p.property_type || !["A", "B", "C"].includes(p.property_type)) {
      return `Property ${p.id}: property_type must be A, B, or C`;
    }
  }

  if (!Array.isArray(hydrants)) {
    return "hydrants[] must be an array (can be empty)";
  }

  for (const h of hydrants) {
    if (!h.id || h.lat == null || h.lng == null) {
      return "Each hydrant must have: id, lat, lng";
    }
  }

  return null; // valid
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

exports.handler = async event => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const respond = (statusCode, body) => ({
    statusCode,
    headers,
    body: JSON.stringify(body),
  });

  // ── JWT auth ───────────────────────────────────────────────────────────────
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    return respond(500, { error: "Authentication not configured" });
  }

  try {
    const authHeader =
      event.headers?.authorization ?? event.headers?.Authorization;
    const decoded = verifySupabaseToken(authHeader, jwtSecret);
    console.log(`Authenticated request from user: ${decoded.sub}`);
  } catch (authErr) {
    return respond(401, { error: "Unauthorized", message: authErr.message });
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let input;
  try {
    input = JSON.parse(event.body);
  } catch {
    return respond(400, { error: "Invalid JSON body" });
  }

  // Destructure with safe defaults
  const { hub, vehicles } = input;
  const sessionName = input.sessionName ?? input.session_name;
  const sessionDate = input.date ?? input.sessionDate;

  if (!sessionName || !sessionDate) {
    return respond(400, { error: "session_name and date are required" });
  }

  // ── Supabase properties + hydrants ───────────────────────────────────────
  let properties;
  let hydrants;
  try {
    const propertyLimit = Array.isArray(vehicles)
      ? vehicles.length * PROPS_PER_TEAM
      : 0;
    properties = await fetchSupabaseProperties(propertyLimit);
    hydrants = await fetchSupabaseHydrants();
  } catch (supabaseErr) {
    console.error("Supabase data fetch error:", supabaseErr);
    return respond(500, {
      error: "Failed to load routing data from Supabase",
      details: supabaseErr.message,
    });
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  const validationError = validateInput({
    hub,
    vehicles,
    properties,
    hydrants,
  });
  if (validationError) {
    return respond(400, { error: validationError });
  }

  // ── Google credentials ─────────────────────────────────────────────────────
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const serviceAccountKeyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!projectId || !serviceAccountKeyB64) {
    return respond(500, { error: "Google Cloud credentials not configured" });
  }

  // ── Optimize ───────────────────────────────────────────────────────────────
  try {
    const serviceAccountKey = JSON.parse(
      Buffer.from(serviceAccountKeyB64, "base64").toString("utf-8"),
    );
    const accessToken = await getAccessToken(serviceAccountKey);

    const now = new Date();

    console.log(
      `Starting tiered optimization with Supabase properties: ${properties.length} properties, ` +
        `${hydrants.length} hydrants, ` +
        `${vehicles.length} vehicles`,
    );

    const result = await runTieredOptimization(
      hub,
      properties,
      vehicles,
      hydrants,
      accessToken,
      projectId,
      now,
    );

    const persistenceResult = await persistGeneratedRoutesToSupabase({
      sessionName,
      sessionDate,
      routes: result.routes,
      vehicles,
    });

    return respond(200, {
      ...result,
      persistence: persistenceResult,
    });
  } catch (err) {
    console.error("Route optimization error:", err);
    return respond(500, { error: err.message, details: err.toString() });
  }
};
