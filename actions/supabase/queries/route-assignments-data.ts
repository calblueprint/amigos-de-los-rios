import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@/types/schema";

export async function assignUserToRoute(
  client: SupabaseClient,
  routeId: string,
  userId: string,
  sessionId: string,
) {
  const { error } = await client.from("Route User Assignments").insert([
    {
      route_id: routeId,
      user_id: userId,
      session_id: sessionId,
      published: true,
    },
  ]);

  if (error) throw error;
}

export async function unassignUserFromRoute(
  client: SupabaseClient,
  routeId: string,
  userId: string,
) {
  const { error } = await client
    .from("Route User Assignments")
    .delete()
    .eq("route_id", routeId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getAssignedUsersByRouteId(
  client: SupabaseClient,
  routeId: string,
) {
  const { data, error } = await client
    .from("Route User Assignments")
    .select(`Users(*)`)
    .eq("route_id", routeId);

  if (error) throw error;

  return data.flatMap(row => {
    const u = row.Users as User | User[] | null;
    if (Array.isArray(u)) return u;
    if (u && typeof u === "object") return [u];
    return [];
  });
}
