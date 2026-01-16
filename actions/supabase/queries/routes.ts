import { Property, Route } from "@/types/schema";
import supabase from "../client";

type WateringSession = {
  id: string;
  date: string;
  watering_event_name: string;
  central_hub: string;
};

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
    .from("Property")
    .select("*")
    .eq("route_id", routeId)
    .order("order_to_visit", { ascending: true });

  if (propError) throw propError;

  return props || [];
}

export async function fetchPropertiesByRouteId(routeId: string) {
  const { data: props, error: propError } = await supabase
    .from("Property")
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

  // if (routeError || !routes || routes.length === 0) {
  //   throw new Error("No matching route found for this session and/or user.");
  // }

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

export async function createRoute(routeData: Omit<Route, "id">) {
  const { data, error } = await supabase
    .from("Routes")
    .insert([routeData])
    .select()
    .single();

  if (error) throw error;
  return data as Route;
}

export async function createProperties(propertiesData: Omit<Property, "id">[]) {
  const { data, error } = await supabase
    .from("Property")
    .insert(propertiesData)
    .select();

  if (error) throw error;
  return data as Property[];
}
