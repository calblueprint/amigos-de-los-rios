import supabase from "../client";

export async function fetchSessionById(sessionId: string) {
  const { data, error } = await supabase
    .from("Watering Sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) return null;
  return data;
}
