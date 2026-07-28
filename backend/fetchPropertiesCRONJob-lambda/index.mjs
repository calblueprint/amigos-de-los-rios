import { createClient } from "@supabase/supabase-js";

/**
 * =============================================================================
 * PlanitGeo → Supabase Sync — AWS Lambda Handler
 * =============================================================================
 *
 * This Lambda function runs on a scheduled cron trigger (EventBridge) and
 * syncs data from the PlanitGeo tree inventory API into a Supabase database.
 *
 * What it does:
 *   1. Fetches all tree inventory features from the PlanitGeo API in batches
 *   2. Filters each batch by organization code:
 *        - org 176 → Properties (trees/parcels)
 *        - org 177 → Hydrants
 *   3. Transforms each feature into the shape expected by the DB schema
 *   4. Upserts each batch into the corresponding Supabase table immediately,
 *      then discards it from memory before fetching the next batch
 *
 * Required environment variables (set in Lambda → Configuration → Env vars):
 *   - PLANITGEO_API_KEY
 *   - PLANITGEO_USERNAME
 *   - PLANITGEO_PASSWORD
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * Supabase tables written to:
 *   - "Property"  (upsert conflict on: pid)
 *   - "Hydrants"  (upsert conflict on: hydrant_id)
 * =============================================================================
 */

// ── Environment variables ──────────────────────────────────────────────────────
// Pull all required secrets from Lambda environment variables.
// Fails fast at cold start if any are missing rather than failing mid-run.
const PLANITGEO_API_KEY = process.env.PLANITGEO_API_KEY;
const PLANITGEO_USERNAME = process.env.PLANITGEO_USERNAME;
const PLANITGEO_PASSWORD = process.env.PLANITGEO_PASSWORD;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !PLANITGEO_API_KEY ||
  !PLANITGEO_USERNAME ||
  !PLANITGEO_PASSWORD ||
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error("Missing required environment variables.");
}

// Initialize Supabase with the service role key (bypasses row-level security,
// safe to use here since Lambda is a trusted server-side environment).
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// PlanitGeo uses HTTP Basic Auth — encode username:password as base64 once
// at startup so we don't redo it on every request.

const credentials = Buffer.from(
  `${PLANITGEO_USERNAME}:${PLANITGEO_PASSWORD}`,
).toString("base64");

/**
 * Returns the auth headers required for every PlanitGeo API request.
 * Combines HTTP Basic Auth (username:password) with JSON accept header.
 */

function getAuthHeaders() {
  return {
    Authorization: `Basic ${credentials}`,
    Accept: "application/json",
  };
}

/**
 * Logs current heap memory usage to CloudWatch with a label.
 * Useful for tracking memory across batch fetches and upserts to diagnose
 * out-of-memory issues.
 */

function logMemory(label) {
  const mb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  console.log(`[memory] ${label}: ${mb} MB used`);
}

// ── Transform helpers ─────────────────────────────────────────────────────────

/**
 * Transforms a raw PlanitGeo feature (organization 176) into a Property row
 * shaped for the Supabase "Property" table.
 *
 * Notable mappings:
 *   - address: prefers address_number + address_street, falls back to address_num_street
 *   - water_onsite: true when _useradd_6865956bca734 === 2 (2 = irrigated)
 *   - prev_watered: converts last_modified Unix timestamp to ISO string
 */

function toDbProperty(f) {
  const p = f.properties;
  const address =
    p.address_number && p.address_street
      ? `${p.address_number} ${p.address_street}`
      : (p.address_num_street ?? "N/A");

  return {
    pid: p.pid,
    address,
    latitude: p.lat,
    longitude: p.lng,
    water_onsite: p._useradd_6865956bca734 === 2,
    num_trees: p.tree_num ?? null,
    prev_watered: p.last_modified
      ? new Date(p.last_modified).toISOString()
      : null,
  };
}

/**
 * Transforms a raw PlanitGeo feature (organization 177) into a Hydrant row
 * shaped for the Supabase "Hydrants" table.
 *
 * Notable mappings:
 *   - hydrant_address: same address fallback logic as toDbProperty
 *   - hydrant_type: maps from species_common field (TODO: confirm correct field with Bhavita)
 */

function toDbHydrant(f) {
  const p = f.properties;
  const hydrant_address =
    p.address_number && p.address_street
      ? `${p.address_number} ${p.address_street}`
      : (p.address_num_street ?? "N/A");

  return {
    hydrant_id: p.pid,
    hydrant_address,
    latitude: p.lat,
    longitude: p.lng,
    hydrant_type: p.species_common ?? null,
  };
}

// ── Supabase upserts ──────────────────────────────────────────────────────────

/**
 * Upserts an array of Property rows into the Supabase "Property" table.
 * Uses pid as the conflict key — existing records are updated, new ones inserted.
 * Skips the call entirely if the array is empty to avoid unnecessary DB round trips.
 */

async function upsertProperties(properties) {
  if (properties.length === 0) return;
  const { error } = await supabase
    .from("Property")
    .upsert(properties, { onConflict: "pid" });
  if (error) throw new Error(`Properties upsert failed: ${error.message}`);
  console.log(`Upserted ${properties.length} properties.`);
}

/**
 * Upserts an array of Hydrant rows into the Supabase "Hydrants" table.
 * Uses hydrant_id as the conflict key — existing records are updated, new ones inserted.
 * Skips the call entirely if the array is empty to avoid unnecessary DB round trips.
 */

async function upsertHydrants(hydrants) {
  if (hydrants.length === 0) return;
  const { error } = await supabase
    .from("Hydrants")
    .upsert(hydrants, { onConflict: "hydrant_id" });
  if (error) throw new Error(`Hydrants upsert failed: ${error.message}`);
  console.log(`Upserted ${hydrants.length} hydrants.`);
}

// ── Lambda handler ────────────────────────────────────────────────────────────

/**
 * Main Lambda entry point — called by EventBridge on the cron schedule.
 *
 * Paginates through the PlanitGeo API in batches of 500, processing and
 * upserting each batch immediately rather than accumulating everything in
 * memory first. This keeps memory usage low regardless of total dataset size.
 *
 * The loop exits when PlanitGeo returns fewer than LIMIT features, which
 * signals the last page.
 */

export const handler = async () => {
  console.log("Lambda invoked: starting sync...");
  logMemory("start");

  const LIMIT = 500;
  let offset = 0;
  let totalProperties = 0;
  let totalHydrants = 0;
  let batchNum = 0;

  while (true) {
    batchNum++;
    console.log(`--- Batch ${batchNum} | offset=${offset} ---`);
    logMemory("before fetch");

    const url = `https://pg-cloud.com/api/amigosdelosrios/inventories/trees?apiKey=${PLANITGEO_API_KEY}&offset=${offset}&limit=${LIMIT}`;

    let batch;
    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `PlanitGeo API error ${res.status}: ${text.slice(0, 300)}`,
        );
      }
      const json = await res.json();
      batch = json?.data?.features ?? [];
      console.log(`Fetched ${batch.length} features`);
    } catch (err) {
      console.error(`Fetch failed at offset ${offset}:`, err.message);
      throw err;
    }

    logMemory("after fetch");

    const properties = batch
      .filter(f => f.properties?.organization === 176)
      .map(toDbProperty);

    const hydrants = batch
      .filter(f => f.properties?.organization === 177)
      .map(toDbHydrant);

    console.log(
      `Filtered: ${properties.length} properties, ${hydrants.length} hydrants`,
    );

    await upsertProperties(properties);
    await upsertHydrants(hydrants);

    totalProperties += properties.length;
    totalHydrants += hydrants.length;

    logMemory("after upsert");

    const done = batch.length < LIMIT;
    batch = null;

    if (done) break;
    offset += LIMIT;
  }

  console.log(
    `Sync complete. ${totalProperties} properties, ${totalHydrants} hydrants upserted.`,
  );
  return {
    statusCode: 200,
    body: `Sync complete. ${totalProperties} properties, ${totalHydrants} hydrants upserted.`,
  };
};
