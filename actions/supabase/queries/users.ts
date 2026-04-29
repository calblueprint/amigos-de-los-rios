import supabase from "@/actions/supabase/client";

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

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

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from("Users")
    .select("id, name, email, affiliation")
    .eq("is_admin", true);

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

export async function setUserAdminStatus(userId: string, isAdmin: boolean) {
  const { error } = await supabase
    .from("Users")
    .update({ is_admin: isAdmin })
    .eq("id", userId);
  if (error) throw error;
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

export async function updateUserProfile(
  userId: string,
  updatedFields: Record<string, string>,
) {
  const { error } = await supabase
    .from("Users")
    .update(updatedFields)
    .eq("id", userId);

  if (error) throw error;
}
