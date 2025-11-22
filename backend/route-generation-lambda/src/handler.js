/* eslint-disable @typescript-eslint/no-require-imports */
const fetch = require("node-fetch");
const crypto = require("crypto");

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
 * @param {number} teamTimeBudgetMinutes - Total time available for the route
 * @param {string} accessToken - OAuth2 token from getAccessToken()
 * @param {string} projectId - Google Cloud project ID
 * @returns {Object} Optimization result with ordered route and metrics
 */
async function optimizeRoute(
  hub,
  properties,
  teamTimeBudgetMinutes,
  accessToken,
  projectId,
) {
  const now = new Date();
  const endTime = new Date(now.getTime() + teamTimeBudgetMinutes * 60000);

  // Define the vehicle (team) - where it starts/ends and when it's available
  // For now we handle a single vehicle, but can extend to multiple teams later
  const vehicle = {
    startLocation: { latitude: hub.lat, longitude: hub.lng },
    endLocation: { latitude: hub.lat, longitude: hub.lng },
    startTimeWindows: [
      {
        startTime: formatTimestamp(now),
        endTime: formatTimestamp(endTime),
      },
    ],
    endTimeWindows: [
      {
        startTime: formatTimestamp(now),
        endTime: formatTimestamp(endTime),
      },
    ],
  };

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
            endTime: formatTimestamp(endTime),
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
      vehicles: [vehicle],
      globalStartTime: formatTimestamp(now),
      globalEndTime: formatTimestamp(endTime),
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
 * Transforms Google's API response into our frontend-friendly format.
 * Extracts the optimized route order, calculates timing breakdowns, and includes
 * properties that couldn't fit in the time budget.
 */
function formatResponse(optimizationResult, properties, hub) {
  const route = optimizationResult.routes?.[0];

  // If no route was generated, all properties were dropped
  if (!route) {
    return {
      route: null,
      dropped: properties.map(p => ({
        property_id: p.id,
        reason: "Could not fit in time budget",
      })),
    };
  }

  // Map Google's "visits" back to our property data in the optimized order
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

  // Calculate timing breakdown: total duration = travel time + service time
  const totalServiceMin = stops.reduce((sum, s) => sum + s.service_time_min, 0);
  const totalDurationSec = parseInt(
    route.metrics?.totalDuration?.replace("s", "") || "0",
  );
  const totalTravelMin = Math.round(totalDurationSec / 60 - totalServiceMin);

  // Track properties that Google couldn't fit in the route
  const dropped =
    optimizationResult.skippedShipments?.map(s => ({
      property_id: s.label,
      reason: "Could not fit in time budget",
    })) || [];

  return {
    route: {
      stops,
      totals: {
        travel_min: totalTravelMin,
        service_min: totalServiceMin,
        total_min: totalTravelMin + totalServiceMin,
      },
      maps_url: generateMapsUrl(stops, hub),
    },
    dropped,
  };
}

exports.handler = async event => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Parse input
    const input = JSON.parse(event.body);
    const { hub, properties, team_time_budget_minutes } = input;

    // Validate input
    if (!hub || !hub.lat || !hub.lng) {
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

    if (!team_time_budget_minutes || team_time_budget_minutes <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing or invalid team_time_budget_minutes",
        }),
      };
    }

    // Validate each property
    for (const prop of properties) {
      if (!prop.id || !prop.lat || !prop.lng || !prop.service_time_minutes) {
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
      team_time_budget_minutes,
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
