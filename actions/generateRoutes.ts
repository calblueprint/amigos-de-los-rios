// import { UUID } from "crypto";
// import {
//   createProperties,
//   createRoute,
// } from "@/actions/supabase/queries/routes";
// import { createWateringSession } from "@/actions/supabase/queries/sessions";
// import { random } from "@/lib/utils";
// import { RouteStop, Team, WateringSession } from "@/types/schema";
// import { VolunteerType } from "@/types/volunteerType";

// interface GenerateRoutesRequest {
//   sessionName: string;
//   centralHub: string;
//   centralHubAddress: string;
//   date: string;
//   teams: Team[];
// }

// interface GenerateRoutesResponse {
//   session: WateringSession;
// }

// /**
//  * Generate mock properties for a route
//  */
// function generateMockProperties(
//   routeId: UUID,
//   count: number,
// ): Omit<RouteStop, "id">[] {
//   const streetNames = [
//     "Oak Street",
//     "Elm Avenue",
//     "Maple Drive",
//     "Pine Road",
//     "Cedar Lane",
//     "Birch Way",
//     "Willow Court",
//     "Ash Boulevard",
//     "Spruce Street",
//     "Redwood Circle",
//   ];

//   return Array.from({ length: count }, (_, index) => ({
//     route_id: routeId,
//     order_to_visit: index + 1,
//     property_address: `${random(100, 9999)} ${streetNames[random(0, streetNames.length - 1)]}, Berkeley, CA`,
//     property_id: "f1715554-3ef4-4156-8032-f02e91788d25",
//     hydrant_id: null,
//   }));
// }

// /**
//  * Map Team.type string to VolunteerType enum
//  */
// function getVolunteerType(type: string): VolunteerType {
//   switch (type) {
//     case "Type A":
//       return VolunteerType.TypeA;
//     case "Type B":
//       return VolunteerType.TypeB;
//     case "Type C":
//       return VolunteerType.TypeC;
//     case "Type D":
//       return VolunteerType.TypeD;
//     default:
//       return VolunteerType.TypeA;
//   }
// }

// /**
//  * Generate routes for a watering session.
//  * This function mimics an AWS Lambda API call for route generation.
//  *
//  * @param request - The route generation request containing session details and teams
//  * @returns The created watering session
//  * @throws Error if route generation fails
//  */
// export async function generateRoutes(
//   request: GenerateRoutesRequest,
// ): Promise<GenerateRoutesResponse> {
//   const { sessionName, centralHub, centralHubAddress, date, teams } = request;

//   if (
//     !sessionName ||
//     !centralHub ||
//     !centralHubAddress ||
//     !date ||
//     teams.length === 0
//   ) {
//     throw new Error(
//       "Please ensure all session details and at least one team are provided",
//     );
//   }

//   // Create Watering Session
//   const session = await createWateringSession({
//     date,
//     watering_event_name: sessionName,
//     central_hub: centralHub,
//     central_hub_address: centralHubAddress,
//   });

//   // Create routes for each team
//   for (let i = 0; i < teams.length; i++) {
//     const team = teams[i];
//     const route = await createRoute({
//       watering_event_id: session.id as UUID,
//       date,
//       watering_event_name: sessionName,
//       route_label: team.name?.trim() || `Route ${i + 1}`,
//       volunteer_type: getVolunteerType(team.type),
//       maps_link: null,
//       num_volunteers: team.size,
//       compatible_hydrant_types: team.hydrant_type,
//       group_leader_id: null,
//     });

//     // Generate 3-5 mock properties for this route
//     const propertyCount = random(3, 5);
//     const properties = generateMockProperties(route.id, propertyCount);
//     await createProperties(properties);
//   }

//   return { session };
// }

import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import { Team, WateringSession } from "@/types/schema";

interface GenerateRoutesRequest {
  sessionName: string;
  centralHub: string;
  centralHubAddress: string;
  date: string;
  teams: Team[];
  accessToken: string;
}

interface GenerateRoutesResponse {
  session: WateringSession;
}

const ROUTE_SERVICE_URL = process.env.NEXT_PUBLIC_ROUTE_SERVICE_URL;
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

function toTeamTypeCode(type: string): "A" | "B" | "C" | "D" {
  switch (type) {
    case "Type A":
      return "A";
    case "Type B":
      return "B";
    case "Type C":
      return "C";
    case "Type D":
      return "D";
    default:
      throw new Error(`Unsupported volunteer type for optimizer: ${type}`);
  }
}

/**
 * Generate routes for a watering session.
 * Enqueues an optimization job on the OR-Tools routing service and polls
 * until it completes, then loads the resulting session.
 */
export async function generateRoutes(
  request: GenerateRoutesRequest,
): Promise<GenerateRoutesResponse> {
  const {
    sessionName,
    centralHub,
    centralHubAddress,
    date,
    teams,
    accessToken,
  } = request;

  if (
    !sessionName ||
    !centralHub ||
    !centralHubAddress ||
    !date ||
    teams.length === 0
  ) {
    throw new Error(
      "Please ensure all session details and at least one team are provided",
    );
  }

  if (!ROUTE_SERVICE_URL) {
    throw new Error("NEXT_PUBLIC_ROUTE_SERVICE_URL is not configured");
  }

  const body = {
    central_hub_name: centralHub,
    session_name: sessionName,
    session_date: date,
    teams: teams.map(team => ({
      team_type: toTeamTypeCode(team.type),
      time_budget_minutes: team.time * 60, // team.time is hours now
      team_size: team.size,
    })),
    use_cache: true,
  };

  const enqueueRes = await fetch(`${ROUTE_SERVICE_URL}/routes/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!enqueueRes.ok) {
    const text = await enqueueRes.text();
    throw new Error(
      `Failed to start route generation (${enqueueRes.status}): ${text}`,
    );
  }

  const { job_id } = await enqueueRes.json();
  const startedAt = Date.now();

  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

    const statusRes = await fetch(
      `${ROUTE_SERVICE_URL}/routes/status/${job_id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const statusJson = await statusRes.json();

    if (statusJson.status === "complete") {
      const sessionId = statusJson.result.session_id;
      const session = await fetchSessionById(sessionId);
      if (!session) {
        throw new Error(
          "Routes were generated but the session could not be loaded",
        );
      }
      return { session };
    }

    if (statusJson.status === "failed") {
      throw new Error(statusJson.error || "Route generation failed");
    }
  }

  throw new Error("Route generation timed out after 5 minutes");
}
