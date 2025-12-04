import supabase from "@/actions/supabase/client";

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
