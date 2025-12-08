import supabase from "@/actions/supabase/client";

export async function assignUserToRoute(
  routeId: string,
  userId: string,
  sessionId: string,
) {
  const { error } = await supabase.from("Route User Assignments").insert([
    {
      route_id: routeId,
      user_id: userId,
      session_id: sessionId,
      published: true,
    },
  ]);

  if (error) throw error;
}

export async function unassignUserFromRoute(routeId: string, userId: string) {
  const { error } = await supabase
    .from("Route User Assignments")
    .delete()
    .eq("route_id", routeId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getAssignedUsersByRouteId(routeId: string) {
  const { data, error } = await supabase
    .from("Route User Assignments")
    .select(`Users(*)`)
    .eq("route_id", routeId);

  if (error) throw error;

  return data.flatMap(row => row.Users);
}
