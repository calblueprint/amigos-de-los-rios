import { Route, RouteStop, WateringSession } from "@/types/schema";
import supabase from "../client";

export async function fetchSessions() {
  const { data, error } = await supabase
    .from("Watering Sessions")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;

  return (data || []) as WateringSession[];
}

export async function fetchUserRouteProperties(userId: string) {
  const { data: assignments, error: assignmentError } = await supabase
    .from("Route User Assignments")
    .select("route_id")
    .eq("user_id", userId)
    .eq("published", true)
    .limit(1)
    .single();

  if (assignmentError || !assignments) {
    throw new Error("No route assignment found for this user.");
  }

  const routeId = assignments.route_id;

  const { data: props, error: propError } = await supabase
    .from("Route Stops")
    .select("*")
    .eq("route_id", routeId)
    .order("order_to_visit", { ascending: true });

  if (propError) throw propError;

  return props || [];
}

export async function fetchPropertiesByRouteId(routeId: string) {
  const { data: props, error: propError } = await supabase
    .from("Route Stops")
    .select("*")
    .eq("route_id", routeId)
    .order("order_to_visit", { ascending: true });

  if (propError) throw propError;

  return props || [];
}

export async function fetchRoutesBySessionId(sessionId: string) {
  const { data, error } = await supabase
    .from("Routes")
    .select("*")
    .eq("watering_event_id", sessionId);

  if (error) throw error;

  return data;
}

export async function fetchUserRouteForSession(
  userId: string,
  sessionId: string,
) {
  // Find all routes assigned to this user
  const { data: assignments, error: assignmentError } = await supabase
    .from("Route User Assignments")
    .select("route_id")
    .eq("user_id", userId);

  if (assignmentError || !assignments || assignments.length === 0) {
    throw new Error("User has no assigned routes.");
  }

  const routeIds = assignments.map(a => a.route_id);

  // Find which of those routes belong to this watering session
  const { data: routes } = await supabase
    .from("Routes")
    .select("id")
    .in("id", routeIds)
    .eq("watering_event_id", sessionId)
    .limit(1);

  // ask about this its like error thrown versus null returned
  if (!routes || routes.length === 0) {
    return null;
  }

  return routes[0].id as string;
}

export async function fetchAllSessionsForUser(userId: string) {
  const { data: assignments, error: assignmentError } = await supabase
    .from("Route User Assignments")
    .select("session_id")
    .eq("user_id", userId);

  if (assignmentError) throw assignmentError; // Throw like fetchSessions does

  if (!assignments || assignments.length === 0) {
    return []; // Return empty array like fetchSessions does
  }

  const sessionIds = assignments.map(a => a.session_id);

  const { data: sessions, error: sessionError } = await supabase
    .from("Watering Sessions")
    .select("*")
    .in("id", sessionIds)
    .order("date", { ascending: true });

  if (sessionError) throw sessionError;

  return (sessions || []) as WateringSession[];
}

export async function fetchRouteById(routeId: string) {
  const { data, error } = await supabase
    .from("Routes")
    .select("*")
    .eq("id", routeId)
    .single();

  if (error) throw error;

  return data as Route;
}

export async function createRoute(routeData: Omit<Route, "id">) {
  const { data, error } = await supabase
    .from("Routes")
    .insert([routeData])
    .select()
    .single();

  if (error) throw error;
  return data as Route;
}

export async function createProperties(
  propertiesData: Omit<RouteStop, "id">[],
) {
  const { data, error } = await supabase
    .from("Route Stops")
    .insert(propertiesData)
    .select();

  if (error) throw error;
  return data as RouteStop[];
}

export async function deleteRouteById(routeId: string) {
  const { error: routeStopsDeleteError } = await supabase
    .from("Route Stops")
    .delete()
    .eq("route_id", routeId);

  if (routeStopsDeleteError) {
    console.error("Supabase delete route stops error:", routeStopsDeleteError);
    throw new Error(routeStopsDeleteError.message);
  }

  const { error: routeAssignmentsDeleteError } = await supabase
    .from("Route User Assignments")
    .delete()
    .eq("route_id", routeId);

  if (routeAssignmentsDeleteError) {
    console.error(
      "Supabase delete route assignments error:",
      routeAssignmentsDeleteError,
    );
    throw new Error(routeAssignmentsDeleteError.message);
  }

  const { error: routeDeleteError } = await supabase
    .from("Routes")
    .delete()
    .eq("id", routeId);

  if (routeDeleteError) {
    console.error("Supabase delete route error:", routeDeleteError);
    throw new Error(routeDeleteError.message);
  }
}

export async function getGroupLeaderId(
  route_id: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("Routes")
    .select("group_leader_id") // Only grab the column we need!
    .eq("id", route_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Return just the string ID (or null if there isn't one)
  return data?.group_leader_id || null;
}

export async function updateGroupLeader(
  route_id: string,
  leader_id: string | null,
) {
  const { data, error } = await supabase
    .from("Routes")
    .update({ group_leader_id: leader_id })
    .eq("id", route_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
