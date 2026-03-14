import { Hydrant } from "@/types/schema";
import supabase from "../client";

export async function createHydrants(
  hydrants: Omit<Hydrant, "id">[],
): Promise<Hydrant[]> {
  const { data, error } = await supabase
    .from("Hydrants")
    .upsert(hydrants, {
      onConflict: "hydrant_id",
    })
    .select();

  if (error) throw error;
  return data as Hydrant[];
}
