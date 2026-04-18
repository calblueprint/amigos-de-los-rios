import supabase from "@/actions/supabase/client";

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
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

export async function checkUserOnboarded(userId: string): Promise<boolean> {
  const user = await getUserById(userId);

  // If no user record exists or onboarded is false, return false
  if (!user || !user.onboarded) {
    return false;
  }

  return true;
}

export async function changeUserGroupLeader(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) {
    return false;
  }

  const newGroupLeaderStatus = !user.group_leader;

  const { error } = await supabase
    .from("Users")
    .update({ group_leader: newGroupLeaderStatus })
    .eq("id", userId);

  if (error) {
    console.error("Error updating group leader status:", error);
    return false;
  }

  return true;
}

export async function searchUsersInDatabase(searchQuery: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .or(
      `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,affiliation.ilike.%${searchQuery}`,
    );

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
