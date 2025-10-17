"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types/schema";
import supabase from "../../../../actions/supabase/client";

export default function RoutePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const HARDCODED_USER_ID = "e0f4594c-5081-4858-8a20-5dcecb3e3683";

  useEffect(() => {
    async function fetchUserRouteProperties() {
      try {
        setLoading(true);
        const userId = HARDCODED_USER_ID;

        const { data: assignments, error: assignmentError } = await supabase
          .from("Route User Assignments")
          .select("route_id")
          .eq("user_id", userId)
          .eq("published", true)
          .limit(1)
          .single();

        if (assignmentError || !assignments) {
          throw new Error("No route assignment found for this user.");
        }

        const routeId = assignments.route_id;

        const { data: props, error: propError } = await supabase
          .from("Property")
          .select("*")
          .eq("route_id", routeId)
          .order("order_to_visit", { ascending: true });

        if (propError) throw propError;

        setProperties(props || []);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRouteProperties();
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
