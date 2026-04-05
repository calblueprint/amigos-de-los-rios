import { SupabaseClient } from "@supabase/supabase-js";
import { Property, Route, WateringSession } from "@/types/schema";

export async function fetchAllWateringSessions(client: SupabaseClient) {
  const { data, error } = await client
    .from("Watering Sessions")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;

  return (data || []) as WateringSession[];
}

export async function fetchUserRouteProperties(
  client: SupabaseClient,
  userId: string,
) {
  const { data: assignments, error: assignmentError } = await client
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

  const { data: props, error: propError } = await client
    .from("Property")
    .select("*")
    .eq("route_id", routeId)
    .order("order_to_visit", { ascending: true });

  if (propError) throw propError;

  return props || [];
}

export async function fetchPropertiesByRouteId(
  client: SupabaseClient,
  routeId: string,
) {
  const { data: props, error: propError } = await client
    .from("Property")
    .select("*")
    .eq("route_id", routeId)
    .order("order_to_visit", { ascending: true });

  if (propError) throw propError;

  return props || [];
}

export async function fetchRoutesBySessionId(
  client: SupabaseClient,
  sessionId: string,
) {
  const { data, error } = await client
    .from("Routes")
    .select("*")
    .eq("watering_event_id", sessionId);

  if (error) throw error;

  return data;
}

export async function fetchUserRouteForSession(
  client: SupabaseClient,
  userId: string,
  sessionId: string,
) {
  const { data: assignments, error: assignmentError } = await client
    .from("Route User Assignments")
    .select("route_id")
    .eq("user_id", userId);

  if (assignmentError || !assignments || assignments.length === 0) {
    throw new Error("User has no assigned routes.");
  }

  const routeIds = assignments.map(a => a.route_id);

  const { data: routes } = await client
    .from("Routes")
    .select("id")
    .in("id", routeIds)
    .eq("watering_event_id", sessionId)
    .limit(1);

  if (!routes || routes.length === 0) {
    return null;
  }

  return routes[0].id as string;
}

export async function fetchAllSessionsForUser(
  client: SupabaseClient,
  userId: string,
) {
  const { data: assignments, error: assignmentError } = await client
    .from("Route User Assignments")
    .select("session_id")
    .eq("user_id", userId);

  if (assignmentError) throw assignmentError;

  if (!assignments || assignments.length === 0) {
    return [];
  }

  const sessionIds = assignments.map(a => a.session_id);

  const { data: sessions, error: sessionError } = await client
    .from("Watering Sessions")
    .select("*")
    .in("id", sessionIds)
    .order("date", { ascending: true });

  if (sessionError) throw sessionError;

  return (sessions || []) as WateringSession[];
}

export async function fetchRouteById(client: SupabaseClient, routeId: string) {
  const { data, error } = await client
    .from("Routes")
    .select("*")
    .eq("id", routeId)
    .single();

  if (error) throw error;

  return data as Route;
}

export async function createRoute(
  routeData: Omit<Route, "id">,
  client: SupabaseClient,
) {
  const { data, error } = await client
    .from("Routes")
    .insert([routeData])
    .select()
    .single();

  if (error) throw error;
  return data as Route;
}

export async function createProperties(
  propertiesData: Omit<Property, "id">[],
  client: SupabaseClient,
) {
  const { data, error } = await client
    .from("Property")
    .insert(propertiesData)
    .select();

  if (error) throw error;
  return data as Property[];
}
