import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import * as db from "./routes-data";

export async function fetchUserRouteProperties(userId: string) {
  return db.fetchUserRouteProperties(getSupabaseBrowserClient(), userId);
}

export async function fetchPropertiesByRouteId(routeId: string) {
  return db.fetchPropertiesByRouteId(getSupabaseBrowserClient(), routeId);
}

export async function fetchUserRouteForSession(
  userId: string,
  sessionId: string,
) {
  return db.fetchUserRouteForSession(
    getSupabaseBrowserClient(),
    userId,
    sessionId,
  );
}

export async function fetchAllSessionsForUser(userId: string) {
  return db.fetchAllSessionsForUser(getSupabaseBrowserClient(), userId);
}

export async function fetchRouteById(routeId: string) {
  return db.fetchRouteById(getSupabaseBrowserClient(), routeId);
}
