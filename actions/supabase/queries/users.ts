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

export async function getUserByName(name: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (error) {
    console.error("Error loading user:", error);
    return null;
  }

  return data;
}

export async function getUserByAffiliation(affiliation: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("affiliation", affiliation)
    .maybeSingle();

  if (error) {
    console.error("Error loading user:", error);
    return null;
  }

  return data;
}

export async function getUserByPhoneNumber(phoneNumber: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (error) {
    console.error("Error loading user:", error);
    return null;
  }

  return data;
}
