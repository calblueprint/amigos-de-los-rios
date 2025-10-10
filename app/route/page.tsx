"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types/schema";
import supabase from "../../actions/supabase/client";

export default function RoutePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRouteProperties() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("No authenticated user found.");
        }

        const { data: assignments, error: assignmentError } = await supabase
          .from("Route User Assignments")
          .select("route_id")
          .eq("user_id", user.id)
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
              <strong>Address:</strong> {p.street_address || "Unknown"} <br />
              <strong>Geo Ref:</strong> {p.planit_geo_reference || "N/A"} <br />
              <strong>Order:</strong> {p.order_to_visit}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
