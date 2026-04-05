import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import * as db from "./sessions-data";

export async function fetchSessionById(sessionId: string) {
  return db.fetchSessionById(getSupabaseBrowserClient(), sessionId);
}
