import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserByEmail(client: SupabaseClient, email: string) {
  const { data, error } = await client
    .from("Users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("Users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading user:", error);
    return null;
  }

  return data;
}

export async function checkUserOnboarded(
  client: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const user = await getUserById(client, userId);

  if (!user || !user.onboarded) {
    return false;
  }

  return true;
}
