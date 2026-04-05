"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import * as routeAssignments from "./queries/route-assignments-data";
import * as routesData from "./queries/routes-data";
import * as usersData from "./queries/users-data";

export type UpsertUserProfileInput = {
  id: string;
  email: string;
  name: string;
  affiliation: string;
  phone_number: string;
  onboarded: boolean;
};

export async function fetchSessionsAdmin() {
  const supabase = await getSupabaseServerClient();
  return routesData.fetchAllWateringSessions(supabase);
}

export async function fetchRoutesBySessionIdAction(sessionId: string) {
  const supabase = await getSupabaseServerClient();
  return routesData.fetchRoutesBySessionId(supabase, sessionId);
}

export async function getUserByEmailAction(email: string) {
  const supabase = await getSupabaseServerClient();
  return usersData.getUserByEmail(supabase, email);
}

export async function getAssignedUsersByRouteIdAction(routeId: string) {
  const supabase = await getSupabaseServerClient();
  return routeAssignments.getAssignedUsersByRouteId(supabase, routeId);
}

export async function assignUserToRouteAction(
  routeId: string,
  userId: string,
  sessionId: string,
) {
  const supabase = await getSupabaseServerClient();
  await routeAssignments.assignUserToRoute(
    supabase,
    routeId,
    userId,
    sessionId,
  );
}

export async function unassignUserFromRouteAction(
  routeId: string,
  userId: string,
) {
  const supabase = await getSupabaseServerClient();
  await routeAssignments.unassignUserFromRoute(supabase, routeId, userId);
}

export async function upsertUserProfileAction(
  profileData: UpsertUserProfileInput,
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Users")
    .upsert(
      {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        affiliation: profileData.affiliation,
        phone_number: profileData.phone_number,
        onboarded: profileData.onboarded,
      },
      {
        onConflict: "id",
      },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Error upserting user profile: ${error.message}`);
  }

  return data;
}
