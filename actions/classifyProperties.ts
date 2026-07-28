"use server";

import { createClient } from "@supabase/supabase-js";

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

export type ClassifyResult =
  | {
      success: true;
      counts: { A: number; B: number; C: number };
      updated: number;
    }
  | { success: false; error: string };

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8;
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

export async function classifyProperties(
  accessToken: string,
): Promise<ClassifyResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { success: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: userRow } = await supabase
    .from("Users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!userRow?.is_admin) {
    return { success: false, error: "Admin access required" };
  }

  const { data: properties, error: propError } = await supabase
    .from("Property")
    .select("id, latitude, longitude, water_onsite");

  if (propError) {
    return {
      success: false,
      error: `Failed to fetch properties: ${propError.message}`,
    };
  }

  const { data: hydrants, error: hydrantError } = await supabase
    .from("Hydrants")
    .select("id, latitude, longitude");

  if (hydrantError) {
    return {
      success: false,
      error: `Failed to fetch hydrants: ${hydrantError.message}`,
    };
  }

  if (!hydrants?.length) {
    return { success: false, error: "No hydrants found" };
  }

  const updates: {
    id: string;
    nearest_hydrant: string;
    property_type: "A" | "B" | "C";
  }[] = [];

  const counts = { A: 0, B: 0, C: 0 };

  for (const property of properties as DbProperty[]) {
    const nearest = findNearestHydrant(property, hydrants as DbHydrant[]);
    if (!nearest) continue;

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
      if (!error) updated++;
    }
  }

  return {
    success: true,
    counts,
    updated,
  };
}
