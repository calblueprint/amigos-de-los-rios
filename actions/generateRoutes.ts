"use server";

import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import { Team, WateringSession } from "@/types/schema";

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

const DEFAULT_HUB = { lat: 34.187457, lng: -118.149968 };
const LAMBDA_ROUTE_URL = process.env.LAMBDA_ROUTE_URL;

interface LambdaVehicle {
  id: string;
  team_type: "A" | "B" | "C" | "D";
  team_time_budget_minutes: number;
  team_size: number;
}

interface LambdaResponse {
  persistence?: {
    watering_session_id: string;
  };
  error?: string;
  details?: string;
}

function parseTimeBudgetMinutes(time: string): number {
  const match = time.match(/(\d+)/);
  if (!match) return 60;
  return parseInt(match[1], 10) * 60;
}

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

function buildVehiclesPayload(teams: Team[]): LambdaVehicle[] {
  return teams.map((team, index) => {
    const teamTypeCode = toTeamTypeCode(team.type);
    return {
      id: `V-${teamTypeCode}${index + 1}`,
      team_type: teamTypeCode,
      team_time_budget_minutes: parseTimeBudgetMinutes(team.time),
      team_size: team.size,
    };
  });
}

/**
 * Generate routes for a watering session.
 * Calls the route-optimization Lambda and returns the created session.
 *
 * @param request - The route generation request containing session details and teams
 * @returns The created watering session
 * @throws Error if route generation fails
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

  if (!LAMBDA_ROUTE_URL) {
    throw new Error(
      "NEXT_PUBLIC_LAMBDA_ROUTE_URL environment variable is not configured",
    );
  }

  const vehicles = buildVehiclesPayload(teams);

  const lambdaPayload = {
    session_name: sessionName,
    date,
    hub: DEFAULT_HUB,
    vehicles,
  };

  const lambdaResponse = await fetch(LAMBDA_ROUTE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(lambdaPayload),
  });

  const responseText = await lambdaResponse.text();
  let result: LambdaResponse = {};

  if (responseText) {
    try {
      result = JSON.parse(responseText) as LambdaResponse;
    } catch {
      if (!lambdaResponse.ok) {
        throw new Error(
          `Route optimization failed (${lambdaResponse.status}): ${responseText}`,
        );
      }
      throw new Error("Route optimizer returned an invalid JSON response");
    }
  }

  if (!lambdaResponse.ok) {
    const errorMessage =
      result.error ??
      `Route optimization failed with status ${lambdaResponse.status}`;
    const details = result.details ? `: ${result.details}` : "";
    throw new Error(`${errorMessage}${details}`);
  }

  const sessionId = result.persistence?.watering_session_id;
  if (!sessionId) {
    throw new Error("Route optimizer did not return a persisted session id");
  }

  const session = await fetchSessionById(sessionId);
  if (!session) {
    throw new Error(
      "Routes were generated but the created session could not be loaded",
    );
  }

  return { session };
}
