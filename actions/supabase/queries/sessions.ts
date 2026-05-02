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
) {
  const { data, error } = await supabase
    .from("Watering Sessions")
    .insert([sessionData])
    .select()
    .single();

  if (error) throw error;
  return data as WateringSession;
}

export async function deleteSessionById(sessionId: string) {
  const { error } = await supabase
    .from("Watering Sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    console.error("Error deleting session:", error);
    throw new Error(`Failed to delete session: ${error.message}`);
  }

  return true;
}

export async function updateSession(
  sessionId: string,
  updatedFields: {
    date?: string;
    watering_event_name?: string;
  },
): Promise<boolean> {
  const { error } = await supabase
    .from("Watering Sessions")
    .update(updatedFields)
    .eq("id", sessionId)
    .select();

  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }

  return true;
}
