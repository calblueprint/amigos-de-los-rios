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
    .single();

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
