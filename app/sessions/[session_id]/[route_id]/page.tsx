"use client";

import { useEffect, useState } from "react";
import { fetchUserRouteProperties } from "@/actions/supabase/queries/routes";
import { Property } from "@/types/schema";

export default function RoutePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const HARDCODED_USER_ID = "e0f4594c-5081-4858-8a20-5dcecb3e3683";

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const props = await fetchUserRouteProperties(HARDCODED_USER_ID);
        setProperties(props);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load properties",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  if (loading) return <p>Loading route...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Route Properties</h1>
      {properties.length === 0 ? (
        <p>No properties found for your route.</p>
      ) : (
        <ol>
          {properties.map(p => (
            <li key={p.id}>
              <strong>Street Address:</strong> {p.street_address || "Unknown"}{" "}
              <br />
              <strong>Planit Geo Ref:</strong> {p.planit_geo_reference || "N/A"}{" "}
              <br />
              <strong>Order To Visit:</strong> {p.order_to_visit}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
