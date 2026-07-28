import { Property } from "@/types/schema";
import supabase from "../client";

const PROPERTY_TABLE = "Property";

type PropertyPriorityRow = Pick<Property, "id" | "address" | "prev_watered">;

export async function fetchAllPropertiesForPriority(): Promise<
  PropertyPriorityRow[]
> {
  const { data, error } = await supabase
    .from(PROPERTY_TABLE)
    .select("id, address, prev_watered")
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []) as PropertyPriorityRow[];
}
