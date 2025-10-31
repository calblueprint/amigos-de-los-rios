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
