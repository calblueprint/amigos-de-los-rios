import { SupabaseClient } from "@supabase/supabase-js";
import { WateringSession } from "@/types/schema";
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

export async function createWateringSession(
  sessionData: Omit<WateringSession, "id">,
  client: SupabaseClient = supabase,
) {
  const { data, error } = await client
    .from("Watering Sessions")
    .insert([sessionData])
    .select()
    .single();

  if (error) throw error;
  return data as WateringSession;
}
