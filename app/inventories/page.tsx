"use client";

import { useEffect, useState } from "react";

// Define the type for the extracted tree info
type TreeInfo = {
  pid: number;
  coordinates: [number, number]; // [lng, lat]
  address: string;
};

type ApiFeature = {
  properties: {
    pid: number;
    address_number?: string;
    address_street?: string;
    address_num_street?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

export default function TreesPage() {
  const [trees, setTrees] = useState<TreeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inventory"); // your API endpoint
        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const json = await res.json();

        // Extract pid, coordinates, and address
        const extracted: TreeInfo[] =
          json?.features?.data?.features?.map((f: ApiFeature) => {
            const p = f.properties;
            const coords: [number, number] = f.geometry.coordinates;

            const address =
              p.address_number && p.address_street
                ? `${p.address_number} ${p.address_street}`
                : (p.address_num_street ?? "N/A");

            return {
              pid: p.pid,
              coordinates: coords,
              address,
            };
          }) ?? [];

        setTrees(extracted);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading trees...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (trees.length === 0) return <p className="p-6">No trees found.</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Tree Inventory 🌳</h1>
      <ul className="space-y-2">
        {trees.map(tree => (
          <li key={tree.pid}>
            <strong>PID:</strong> {tree.pid} — <strong>Coordinates:</strong> [
            {tree.coordinates[1].toFixed(5)}, {tree.coordinates[0].toFixed(5)}]
            — <strong>Address:</strong> {tree.address}
          </li>
        ))}
      </ul>
    </main>
  );
}
