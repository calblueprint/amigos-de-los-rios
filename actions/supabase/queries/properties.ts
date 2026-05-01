import { Property } from "@/types/schema";
import supabase from "../client";

export async function createProperties(
  properties: Omit<Property, "id">[],
): Promise<Property[]> {
  const { data, error } = await supabase
    .from("Property")
    .upsert(properties, {
      onConflict: "address",
    })
    .select();

  if (error) throw error;
  return data as Property[];
}
