"use server";

import { UUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { fetchTreesBatch } from "@/actions/planitgeo/queries/query";
import {
  createProperties,
  createRoute,
} from "@/actions/supabase/queries/routes";
import { createWateringSession } from "@/actions/supabase/queries/sessions";
import { Team, WateringSession } from "@/types/schema";
import { VolunteerType } from "@/types/volunteerType";

// TODO: Replace with actual hub coordinates when available
const DEFAULT_HUB = { lat: 34.0522, lng: -118.2437 };

const LAMBDA_URL = process.env.LAMBDA_ROUTE_URL;
const SERVICE_TIME_MINUTES = 15;

interface GenerateRoutesRequest {
  sessionName: string;
  centralHub: string;
  date: string;
  teams: Team[];
  accessToken: string;
}

interface GenerateRoutesResponse {
  session: WateringSession;
}

interface PlanItGeoFeature {
  properties: {
    pid: number;
    address_number?: string;
    address_street?: string;
    address_num_street?: string;
    species_common?: string;
    organization?: number;
  };
  geometry?: {
    coordinates: [number, number]; // [lng, lat]
  };
}

interface LambdaStop {
  property_id: string;
  address: string;
  lat: number;
  lng: number;
  service_time_min: number;
  arrival_time: string;
}

interface LambdaRoute {
  vehicle_id: string;
  stops: LambdaStop[];
  totals: {
    travel_min: number;
    service_min: number;
    total_min: number;
  };
  maps_url: string | null;
}

interface LambdaResponse {
  route: LambdaRoute[] | null;
  dropped: Array<{
    property_id: string;
    reason: string;
  }>;
}

function getVolunteerType(type: string): VolunteerType {
  switch (type) {
    case "Type A":
      return VolunteerType.TypeA;
    case "Type B":
      return VolunteerType.TypeB;
    case "Type C":
      return VolunteerType.TypeC;
    case "Type D":
      return VolunteerType.TypeD;
    case "Type E":
      return VolunteerType.TypeE;
    default:
      return VolunteerType.TypeA;
  }
}

function parseTimeBudgetMinutes(time: string): number {
  const match = time.match(/(\d+)/);
  if (!match) return 60;
  return parseInt(match[1], 10) * 60;
}

/**
 * Parse PlanItGeo tree features into the format the Lambda expects.
 * Reuses the same parsing pattern from the inventories2 page:
 * filter for valid coordinates and organization 176, then extract
 * pid, lat/lng (swapped from GeoJSON [lng,lat]), and address.
 */
function parseTreesToProperties(features: PlanItGeoFeature[]) {
  return features
    .filter(f => f.geometry?.coordinates && f.properties.organization === 176)
    .map(f => {
      const p = f.properties;
      const coords = f.geometry!.coordinates;

      const address =
        p.address_number && p.address_street
          ? `${p.address_number} ${p.address_street}`
          : (p.address_num_street ?? "N/A");

      return {
        id: String(p.pid),
        lat: coords[1],
        lng: coords[0],
        service_time_minutes: SERVICE_TIME_MINUTES,
        address,
      };
    });
}

/**
 * Fetches tree data from PlanItGeo, sends it to the route-optimization
 * Lambda, then writes the resulting session, routes, and properties
 * into Supabase.
 */
export async function generateRoutes(
  request: GenerateRoutesRequest,
): Promise<GenerateRoutesResponse> {
  const { sessionName, centralHub, date, teams, accessToken } = request;

  if (!sessionName || !centralHub || !date || teams.length === 0) {
    throw new Error(
      "Please ensure all session details and at least one team are provided",
    );
  }

  if (!LAMBDA_URL) {
    throw new Error("LAMBDA_ROUTE_URL environment variable is not configured");
  }

  // Fetch and parse PlanItGeo trees
  const rawTrees = await fetchTreesBatch();
  const properties = parseTreesToProperties(rawTrees as PlanItGeoFeature[]);

  if (properties.length === 0) {
    throw new Error("No properties found from PlanItGeo inventory");
  }

  // Build Lambda request payload
  const vehicles = teams.map((team, index) => ({
    id: `team-${index}`,
    team_time_budget_minutes: parseTimeBudgetMinutes(team.time),
  }));

  const lambdaPayload = {
    hub: DEFAULT_HUB,
    properties: properties.map(p => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      service_time_minutes: p.service_time_minutes,
    })),
    vehicles,
  };

  // Call the route-optimization Lambda
  const lambdaResponse = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(lambdaPayload),
  });

  if (!lambdaResponse.ok) {
    const errorText = await lambdaResponse.text();
    throw new Error(`Route optimization failed: ${errorText}`);
  }

  const result: LambdaResponse = await lambdaResponse.json();

  if (!result.route || result.route.length === 0) {
    throw new Error(
      "Route optimizer could not generate any routes. All properties may have been dropped.",
    );
  }

  // Create a Supabase client authenticated with the user's token
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );

  // Create watering session in Supabase
  const session = await createWateringSession({
    date,
    watering_event_name: sessionName,
    central_hub: centralHub,
  }, authClient);

  // Create routes and properties in Supabase
  const vehicleToTeam = new Map(
    teams.map((team, index) => [`team-${index}`, team]),
  );

  const addressLookup = new Map(properties.map(p => [p.id, p.address]));

  for (let i = 0; i < result.route.length; i++) {
    const lambdaRoute = result.route[i];
    const team = vehicleToTeam.get(lambdaRoute.vehicle_id);

    const route = await createRoute({
      watering_event_id: session.id as UUID,
      date,
      watering_event_name: sessionName,
      route_label: `Route ${i + 1}`,
      volunteer_type: getVolunteerType(team?.type ?? "Type A"),
      maps_link: lambdaRoute.maps_url,
      num_volunteers: team?.size ?? 0,
    }, authClient);

    const propertiesToInsert = lambdaRoute.stops.map((stop, stopIndex) => ({
      route_id: route.id,
      planit_geo_reference: stop.property_id,
      order_to_visit: stopIndex + 1,
      street_address:
        stop.address || addressLookup.get(stop.property_id) || "N/A",
      property_name:
        stop.address || addressLookup.get(stop.property_id) || "N/A",
    }));

    if (propertiesToInsert.length > 0) {
      await createProperties(propertiesToInsert, authClient);
    }
  }

  return { session };
}
