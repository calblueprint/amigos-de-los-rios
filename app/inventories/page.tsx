"use client";

import { useEffect, useState } from "react";

type InventoryItem = {
  id: string;
  alias: string;
  geomType: string;
};

export default function InventoriesPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory")
      .then(res => res.json())
      .then((items: InventoryItem[]) => setData(items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading inventories...</p>;
  }

  if (data.length === 0) {
    return <p className="p-6">No inventories found.</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Mock Inventories</h1>
      <ul>
        {data.map(d => (
          <li key={d.id || d.alias}>
            {" "}
            {/* fallback key if id is missing */}
            {d.alias ?? "Unknown"} ({d.geomType ?? "Unknown type"})
          </li>
        ))}
      </ul>
    </main>
  );
}
