"use client";

import { useEffect, useState } from "react";
import { createProperties } from "@/actions/supabase/queries/properties";
import { Property } from "@/types/schema";

// define custom type that has organization to use in filtering logic later (client-side filtering)
type PropertyDraft = Property & { organization?: number };
type ApiFeatureProperty = {
  properties: {
    pid: number;
    lat: number;
    lng: number;
    address_number?: string;
    address_street?: string;
    address_num_street?: string;
    tree_comments?: string;
    organization?: number;
    _useradd_6865956bca734?: number;
  };
};

// Turns raw API response into a PropertyDraft type
function toPropertyDraft(f: ApiFeatureProperty): PropertyDraft {
  const p = f.properties;

  const address =
    p.address_number && p.address_street
      ? `${p.address_number} ${p.address_street}`
      : (p.address_num_street ?? "N/A");

  return {
    address,
    latitude: p.lat,
    longitude: p.lng,
    water_onsite: p._useradd_6865956bca734 !== 1, // 1 = hand watered, so no onsite water
    num_trees: p.tree_comments ?? "None",
    nearest_hydrant: "401db03e-d179-4a0e-ba69-1a092f208cf8", // TODO: replace with real value
    prev_watered: false, // TODO: replace with real value
    organization: p.organization,
  };
}

// Strips `organization` before sending to DB since it's not part of the schema
function toDbProperty(draft: PropertyDraft): Omit<Property, "id"> {
  const { organization: _organization, ...rest } = draft;
  return rest;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const json = await res.json();
        const features: ApiFeatureProperty[] = json.features ?? json;

        setProperties(features.map(toPropertyDraft));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // push filter server side and maybe manage slicing thing?
  // code 176: "Altadena Tree Protection: Properties Served"
  const filteredProperties = properties.filter(p => p.organization === 176);

  const handleUpsertProperties = async () => {
    await createProperties(filteredProperties.map(toDbProperty));
    console.log("Properties upserted!");
  };

  if (loading) return <p className="p-6">Loading trees...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (properties.length === 0) return <p className="p-6">No trees found.</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Tree Inventory 🌳</h1>
      <button
        onClick={handleUpsertProperties}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        upsert properties
      </button>

      <ul className="space-y-2">
        {filteredProperties.map(property => (
          <li key={crypto.randomUUID()}>
            <strong>Address:</strong> {property.address} —{" "}
            <strong>Latitude:</strong> {property.latitude} —{" "}
            <strong>Longitude:</strong> {property.longitude} —{" "}
            <strong>Comments:</strong> {property.num_trees}
          </li>
        ))}
      </ul>
    </main>
  );
}
