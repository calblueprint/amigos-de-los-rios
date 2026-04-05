import { SupabaseClient } from "@supabase/supabase-js";
import { WateringSession } from "@/types/schema";

export async function fetchSessionById(
  client: SupabaseClient,
  sessionId: string,
) {
  const { data, error } = await client
    .from("Watering Sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) return null;
  return data;
}

export async function createWateringSession(
  sessionData: Omit<WateringSession, "id">,
  client: SupabaseClient,
) {
  const { data, error } = await client
    .from("Watering Sessions")
    .insert([sessionData])
    .select()
    .single();

  if (error) throw error;
  return data as WateringSession;
}
