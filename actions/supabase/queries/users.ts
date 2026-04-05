import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import * as db from "./users-data";

export async function getUserById(userId: string) {
  return db.getUserById(getSupabaseBrowserClient(), userId);
}

export async function checkUserOnboarded(userId: string): Promise<boolean> {
  return db.checkUserOnboarded(getSupabaseBrowserClient(), userId);
}
