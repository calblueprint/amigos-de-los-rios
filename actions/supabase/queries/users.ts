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

  if (error) throw error;

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

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("name, email, affiliation, phone_number")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
