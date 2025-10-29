/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require("crypto");

// Verify Supabase JWT token
function verifyJWT(token, secret) {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return null;
    }

    // Verify signature
    const data = `${headerB64}.${payloadB64}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("base64url");

    if (signature !== signatureB64) {
      return null;
    }

    // Decode and verify expiration
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }

    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

exports.handler = async event => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Verify JWT token
  const authHeader =
    event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        error: "Missing or invalid authorization header",
      }),
    };
  }

  const token = authHeader.substring(7);
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    console.error("SUPABASE_JWT_SECRET not configured");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  const payload = verifyJWT(token, jwtSecret);
  if (!payload) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Invalid or expired token" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // Return dummy route data
    const response = {
      routes: [
        {
          vehicle_id: "A-1",
          team_type: "A",
          totals: { travel_min: 45, service_min: 120, route_min: 165 },
          stops: [
            {
              property_id: "p1",
              address: "123 Oak St",
              est_service_min: 30,
              travel_time_min: 10,
            },
            {
              property_id: "p2",
              address: "456 Elm St",
              est_service_min: 25,
              travel_time_min: 8,
            },
          ],
          maps_urls: [
            "https://www.google.com/maps/dir/?api=1&origin=34.1478,-118.1445&destination=34.1478,-118.1445&waypoints=34.148,-118.145|34.151,-118.142&travelmode=driving",
          ],
        },
        {
          vehicle_id: "B-1",
          team_type: "B",
          totals: { travel_min: 38, service_min: 90, route_min: 128 },
          stops: [
            {
              property_id: "p3",
              address: "789 Pine St",
              est_service_min: 35,
              travel_time_min: 12,
            },
          ],
          maps_urls: [
            "https://www.google.com/maps/dir/?api=1&origin=34.1478,-118.1445&destination=34.1478,-118.1445&waypoints=34.149,-118.147&travelmode=driving",
          ],
        },
      ],
      dropped: [],
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
