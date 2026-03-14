import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Script runs without a user session — use service role to bypass RLS
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env",
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "Using anon key — RLS may block updates. Add SUPABASE_SERVICE_ROLE_KEY to .env to bypass RLS.",
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FEET_PER_MILE = 5280;
const HYDRANT_RADIUS_FT = 200;
const HYDRANT_RADIUS_MILES = HYDRANT_RADIUS_FT / FEET_PER_MILE;
const BATCH_SIZE = 50;

interface DbProperty {
  id: string;
  latitude: number | null;
  longitude: number | null;
  water_onsite: boolean;
}

interface DbHydrant {
  id: string;
  latitude: number;
  longitude: number;
}

/**
 * Great-circle distance between two lat/lng points in miles (haversine formula).
 */
function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8; // Earth radius in miles

  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function findNearestHydrant(
  property: DbProperty,
  hydrants: DbHydrant[],
): { hydrantId: string; distanceMiles: number } | null {
  if (property.latitude == null || property.longitude == null) return null;

  let nearestId: string | null = null;
  let nearestDist = Infinity;

  for (const hydrant of hydrants) {
    const dist = haversine(
      property.latitude,
      property.longitude,
      hydrant.latitude,
      hydrant.longitude,
    );
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestId = hydrant.id;
    }
  }

  if (nearestId === null) return null;
  return { hydrantId: nearestId, distanceMiles: nearestDist };
}

function classifyProperty(
  waterOnsite: boolean,
  nearestHydrantDistMiles: number | null,
): "A" | "B" | "C" {
  if (waterOnsite) return "A";
  if (
    nearestHydrantDistMiles !== null &&
    nearestHydrantDistMiles <= HYDRANT_RADIUS_MILES
  ) {
    return "B";
  }
  return "C";
}

async function fetchAllProperties(): Promise<DbProperty[]> {
  const { data, error } = await supabase
    .from("Property")
    .select("id, latitude, longitude, water_onsite");

  if (error) throw new Error(`Failed to fetch properties: ${error.message}`);
  return data as DbProperty[];
}

async function fetchAllHydrants(): Promise<DbHydrant[]> {
  const { data, error } = await supabase
    .from("Hydrants")
    .select("id, latitude, longitude");

  if (error) throw new Error(`Failed to fetch hydrants: ${error.message}`);
  return data as DbHydrant[];
}

async function main() {
  console.log("Fetching properties and hydrants...");

  const [properties, hydrants] = await Promise.all([
    fetchAllProperties(),
    fetchAllHydrants(),
  ]);

  console.log(
    `Loaded ${properties.length} properties and ${hydrants.length} hydrants.`,
  );

  if (hydrants.length === 0) {
    console.error("No hydrants found — cannot compute nearest hydrant.");
    process.exit(1);
  }

  const updates: {
    id: string;
    nearest_hydrant: string;
    property_type: "A" | "B" | "C";
  }[] = [];

  const counts = { A: 0, B: 0, C: 0, skipped: 0 };

  for (const property of properties) {
    const nearest = findNearestHydrant(property, hydrants);

    if (!nearest) {
      counts.skipped++;
      continue;
    }

    const propertyType = classifyProperty(
      property.water_onsite,
      nearest.distanceMiles,
    );
    counts[propertyType]++;

    updates.push({
      id: property.id,
      nearest_hydrant: nearest.hydrantId,
      property_type: propertyType,
    });
  }

  console.log("\nClassification results:");
  console.log(`  Type A (water onsite):        ${counts.A}`);
  console.log(`  Type B (hydrant within 200ft): ${counts.B}`);
  console.log(`  Type C (needs truck):          ${counts.C}`);
  if (counts.skipped > 0) {
    console.log(`  Skipped (no lat/lng):          ${counts.skipped}`);
  }

  console.log(`\nUpdating ${updates.length} properties in batches of ${BATCH_SIZE}...`);

  let updated = 0;
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(({ id, nearest_hydrant, property_type }) =>
        supabase
          .from("Property")
          .update({ nearest_hydrant, property_type })
          .eq("id", id),
      ),
    );

    for (const { error } of results) {
      if (error) {
        console.error(`  Update error: ${error.message}`);
      } else {
        updated++;
      }
    }

    console.log(`  Updated ${Math.min(i + BATCH_SIZE, updates.length)} / ${updates.length}`);
  }

  console.log(`\nDone. Successfully updated ${updated} properties.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
