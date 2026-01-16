import { UUID } from "crypto";
import {
  createProperties,
  createRoute,
} from "@/actions/supabase/queries/routes";
import { createWateringSession } from "@/actions/supabase/queries/sessions";
import { random } from "@/lib/utils";
import { Property, Team, WateringSession } from "@/types/schema";
import { VolunteerType } from "@/types/volunteerType";

interface GenerateRoutesRequest {
  sessionName: string;
  centralHub: string;
  date: string;
  teams: Team[];
}

interface GenerateRoutesResponse {
  session: WateringSession;
}

/**
 * Generate mock properties for a route
 */
function generateMockProperties(
  routeId: UUID,
  count: number,
): Omit<Property, "id">[] {
  const streetNames = [
    "Oak Street",
    "Elm Avenue",
    "Maple Drive",
    "Pine Road",
    "Cedar Lane",
    "Birch Way",
    "Willow Court",
    "Ash Boulevard",
    "Spruce Street",
    "Redwood Circle",
  ];
  const propertyTypes = [
    "Residential",
    "Park",
    "Community Garden",
    "School",
    "Library",
    "Community Center",
  ];

  return Array.from({ length: count }, (_, index) => ({
    route_id: routeId,
    planit_geo_reference: null,
    order_to_visit: index + 1,
    street_address: `${random(100, 9999)} ${streetNames[random(0, streetNames.length - 1)]}, Berkeley, CA`,
    property_name: `${propertyTypes[random(0, propertyTypes.length - 1)]} - ${streetNames[random(0, streetNames.length - 1)]}`,
  }));
}

/**
 * Map Team.type string to VolunteerType enum
 */
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

/**
 * Generate routes for a watering session.
 * This function mimics an AWS Lambda API call for route generation.
 *
 * @param request - The route generation request containing session details and teams
 * @returns The created watering session
 * @throws Error if route generation fails
 */
export async function generateRoutes(
  request: GenerateRoutesRequest,
): Promise<GenerateRoutesResponse> {
  const { sessionName, centralHub, date, teams } = request;

  if (!sessionName || !centralHub || !date || teams.length === 0) {
    throw new Error(
      "Please ensure all session details and at least one team are provided",
    );
  }

  // Create Watering Session
  const session = await createWateringSession({
    date,
    watering_event_name: sessionName,
    central_hub: centralHub,
  });

  // Create routes for each team
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const route = await createRoute({
      watering_event_id: session.id as UUID,
      date,
      watering_event_name: sessionName,
      route_label: `Route ${i + 1}`,
      volunteer_type: getVolunteerType(team.type),
      maps_link: null,
      num_volunteers: team.size,
    });

    // Generate 3-5 mock properties for this route
    const propertyCount = random(3, 5);
    const properties = generateMockProperties(route.id, propertyCount);
    await createProperties(properties);
  }

  return { session };
}
