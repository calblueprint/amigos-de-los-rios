"use client";

import { useEffect, useState } from "react";
import { createHydrants } from "@/actions/supabase/queries/hydrants";
import { Hydrant } from "@/types/schema";

// define custom type that has organization to use in filtering logic later (client-side filtering)
type HydrantDraft = Hydrant & { organization?: number };
type ApiFeatureHydrant = {
  properties: {
    pid: number;
    lat: number;
    lng: number;
    address_number?: string;
    address_street?: string;
    address_num_street?: string;
    organization?: number;
  };
};

// Turns raw API response into a hydrantDraft type
function toHydrantDraft(f: ApiFeatureHydrant): HydrantDraft {
  const p = f.properties;

  const address =
    p.address_number && p.address_street
      ? `${p.address_number} ${p.address_street}`
      : (p.address_num_street ?? "N/A");

  return {
    hydrant_id: p.pid,
    hydrant_address: address,
    latitude: p.lat,
    longitude: p.lng,
    hydrant_type: "FILL", // TODO replace with actual hydrant_type from API ask bhavita about this
    organization: p.organization,
  };
}

// Strips `organization` before sending to DB since it's not part of the schema
function toDbHydrant(draft: HydrantDraft): Omit<Hydrant, "id"> {
  const { organization: _organization, ...rest } = draft;
  return rest;
}

export default function HydrantsPage() {
  const [hydrants, setHydrants] = useState<HydrantDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const json = await res.json();
        const features: ApiFeatureHydrant[] = json.features ?? json;

        setHydrants(features.map(toHydrantDraft));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // push filter server side and maybe manage slicing thing?
  // code 177: "Altadena Tree Protection: Hydrants"
  const filteredHydrants = hydrants.filter(p => p.organization === 177);

  const handleUpsertHydrants = async () => {
    await createHydrants(filteredHydrants.map(toDbHydrant));
    console.log("Hydrants upserted!");
  };

  if (loading) return <p className="p-6">Loading hydrants...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (hydrants.length === 0) return <p className="p-6">No hydrants found.</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Hydrant Inventory 🧯</h1>
      <button
        onClick={handleUpsertHydrants}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        upsert hydrants
      </button>

      <ul className="space-y-2">
        {filteredHydrants.map(hydrant => (
          <li key={crypto.randomUUID()}>
            <strong>Hydrant Address:</strong> {hydrant.hydrant_address} —{" "}
            <strong>Latitude:</strong> {hydrant.latitude} —{" "}
            <strong>Longitude:</strong> {hydrant.longitude} —{" "}
            <strong>Hydrant ID:</strong> {hydrant.hydrant_id}
          </li>
        ))}
      </ul>
    </main>
  );
}
