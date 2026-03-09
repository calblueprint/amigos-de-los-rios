/* eslint-disable @typescript-eslint/no-require-imports */
const fetch = require("node-fetch");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Generates an OAuth2 access token for authenticating with Google Cloud APIs.
 *
 * Google's Route Optimization API requires OAuth2 (not API keys). To authenticate,
 * we create a signed JWT from our service account, then exchange it for an access token.
 * This token is valid for 1 hour and lets us make API calls on behalf of the service account.
 *
 * @param {Object} serviceAccountKey - The JSON key from Google Cloud service account
 * @returns {string} Access token to use in Authorization header
 */
async function getAccessToken(serviceAccountKey) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // Token valid for 1 hour

  // Build the JWT payload (claims) - tells Google who we are and what we want access to
  const claims = {
    iss: serviceAccountKey.client_email, // Who is making the request
    scope: "https://www.googleapis.com/auth/cloud-platform", // What permissions we need
    aud: "https://oauth2.googleapis.com/token", // Who should verify this token
    iat: now, // When token was issued
    exp: expiry, // When token expires
  };

  // JWT header specifies we're using RSA-SHA256 signing algo
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

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
  const jwt = `${signatureInput}.${signature}`;

  // Exchange the signed JWT for a short-lived access token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OAuth2 token exchange failed: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Formats timestamps to exclude milliseconds/nanoseconds
 * Route Optimization API strictly requires RFC3339 format with whole seconds only
 */
function formatTimestamp(date) {
  return date.toISOString().split(".")[0] + "Z";
}

/**
 * Calls Google's Route Optimization API to generate an optimized route
 *
 * Sends our properties (locations to visit) and constraints (time budget, service times)
 * to Google's optimizer. Finds the best route order that minimizes travel time
 *
 * @param {Object} hub - Starting/ending location with lat/lng
 * @param {Array} properties - Locations to visit with service times
 * @param {Array} vehiclesInput - Total time available for each team traveling in each vehicle
 * @param {string} accessToken - OAuth2 token from getAccessToken()
 * @param {string} projectId - Google Cloud project ID
 * @returns {Object} Optimization result with ordered route and metrics
 */
async function optimizeRoute(
  hub,
  properties,
  vehiclesInput,
  accessToken,
  projectId,
) {
  const now = new Date();

  // Define the vehicles (teams) - where it starts/ends and when it's available
  const vehicles = vehiclesInput.map(v => {
    const vehicleEndTime = new Date(
      now.getTime() + v.team_time_budget_minutes * 60000,
    );

    return {
      label: v.id,
      startLocation: {
        latitude: hub.lat,
        longitude: hub.lng,
      },
      endLocation: {
        latitude: hub.lat,
        longitude: hub.lng,
      },
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
    };
  });

  // final end, when all teams are done
  const maxEndTime = new Date(
    Math.max(
      ...vehiclesInput.map(
        v => now.getTime() + v.team_time_budget_minutes * 60000,
      ),
    ),
  );

  // Define shipments - each property is a "delivery" the vehicle must make
  // Google's API terminology uses "shipments" for any visit/stop
  const shipments = properties.map(property => ({
    deliveries: [
      {
        arrivalLocation: {
          latitude: property.lat,
          longitude: property.lng,
        },
        duration: `${property.service_time_minutes * 60}s`, // How long we'll spend at this property
        timeWindows: [
          {
            startTime: formatTimestamp(now),
            endTime: formatTimestamp(maxEndTime),
          },
        ],
      },
    ],
    label: property.id, // Helps match results back to our input properties
  }));

  // Build the complete optimization request
  const request = {
    model: {
      shipments,
      vehicles,
      globalStartTime: formatTimestamp(now),
      globalEndTime: formatTimestamp(maxEndTime),
    },
  };

  // Send request to Google's Route Optimization API
  const response = await fetch(
    `https://routeoptimization.googleapis.com/v1/projects/${projectId}:optimizeTours`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Goog-FieldMask": "routes,skippedShipments,metrics", // Only return fields we need
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Route Optimization API error: ${error}`);
  }

  return await response.json();
}

/**
 * Generates a Google Maps URL for navigation through all stops.
 * This gives teams a clickable link to open in Google Maps for turn-by-turn directions.
 */
function generateMapsUrl(stops, hub) {
  if (!stops || stops.length === 0) return null;

  const waypoints = stops.map(s => `${s.lat},${s.lng}`).join("|");
  return (
    `https://www.google.com/maps/dir/?api=1&` +
    `origin=${hub.lat},${hub.lng}&` +
    `destination=${hub.lat},${hub.lng}&` +
    `waypoints=${waypoints}&` +
    `travelmode=driving`
  );
}

/**
 * Verifies Supabase JWT token from Authorization header.
 * Ensures only authenticated users from your frontend can call this lambda.
 *
 * @param {string} authHeader - The Authorization header value (e.g., "Bearer eyJhbGc...")
 * @param {string} jwtSecret - Supabase JWT secret from environment variables
 * @returns {Object} Decoded JWT payload with user info
 * @throws {Error} If token is missing, invalid, or expired
 */
function verifySupabaseToken(authHeader, jwtSecret) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"], // Supabase uses HMAC-SHA256
    });

    return decoded; // Contains user info (sub = user ID, email, etc.)
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    throw new Error("Invalid token");
  }
}

/**
 * Transforms Google's API response into our frontend-friendly format.
 * Extracts the optimized route order, calculates timing breakdowns, and includes
 * properties that couldn't fit in the time budget.
 */
function formatResponse(optimizationResult, properties, hub) {
  const routes = optimizationResult.routes || [];

  if (routes.length === 0) {
    return {
      route: null,
      dropped: properties.map(p => ({
        property_id: p.id,
        reason: "Could not fit in time budget",
      })),
    };
  }

  const formattedRoutes = routes.map(route => {
    const stops =
      route.visits?.map(visit => {
        const property = properties.find(p => p.id === visit.shipmentLabel);
        return {
          property_id: property.id,
          address: property.address || "N/A",
          lat: property.lat,
          lng: property.lng,
          service_time_min: property.service_time_minutes,
          arrival_time: visit.startTime,
        };
      }) || [];

    const totalServiceMin = stops.reduce(
      (sum, s) => sum + s.service_time_min,
      0,
    );

    const totalDurationSec = Number(
      route.metrics?.totalDuration?.replace("s", "") || "0",
    );

    const totalTravelMin = Math.max(
      0,
      Math.round(totalDurationSec / 60 - totalServiceMin),
    );

    return {
      vehicle_id: route.vehicleLabel,
      stops,
      totals: {
        travel_min: totalTravelMin,
        service_min: totalServiceMin,
        total_min: totalTravelMin + totalServiceMin,
      },
      maps_url: generateMapsUrl(stops, hub),
    };
  });

  const dropped =
    optimizationResult.skippedShipments?.map(s => ({
      property_id: s.label,
      reason: "Could not fit in time budget",
    })) || [];

  return {
    route: formattedRoutes,
    dropped,
  };
}

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

  try {
    // Verify JWT authentication
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Authentication not configured",
        }),
      };
    }

    const authHeader =
      event.headers?.authorization || event.headers?.Authorization;

    try {
      const decoded = verifySupabaseToken(authHeader, jwtSecret);
      // Token is valid - decoded contains user info (decoded.sub = user ID)
      console.log(`Authenticated request from user: ${decoded.sub}`);
    } catch (authError) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "Unauthorized",
          message: authError.message,
        }),
      };
    }
    // Parse input
    let input;

    try {
      input = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON body" }),
      };
    }
    const { hub, properties, vehicles } = input;

    // Validate input
    if (!hub || hub.lat == null || hub.lng == null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing or invalid hub (requires lat, lng)",
        }),
      };
    }

    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing or invalid properties array" }),
      };
    }

    if (properties.length > 1000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Too many properties (max 1000)",
        }),
      };
    }

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "vehicles[] is required" }),
      };
    }

    for (const v of vehicles) {
      if (!v.id || !v.team_time_budget_minutes) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Each vehicle must have id and team_time_budget_minutes",
          }),
        };
      }
    }

    // Validate each property
    for (const prop of properties) {
      if (
        !prop.id ||
        prop.lat == null ||
        prop.lng == null ||
        prop.service_time_minutes == null
      ) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error:
              "Each property must have: id, lat, lng, service_time_minutes",
          }),
        };
      }
    }

    // Get Google credentials
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const serviceAccountKeyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!projectId || !serviceAccountKeyB64) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Google Cloud credentials not configured",
        }),
      };
    }

    // Decode service account key
    const serviceAccountKey = JSON.parse(
      Buffer.from(serviceAccountKeyB64, "base64").toString("utf-8"),
    );

    // Get OAuth2 access token
    const accessToken = await getAccessToken(serviceAccountKey);

    // Call Route Optimization API
    const optimizationResult = await optimizeRoute(
      hub,
      properties,
      vehicles,
      accessToken,
      projectId,
    );

    // Format and return response
    const response = formatResponse(optimizationResult, properties, hub);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Route optimization error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
    };
  }
};
