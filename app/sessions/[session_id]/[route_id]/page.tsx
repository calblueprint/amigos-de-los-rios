"use client";

import { use, useEffect, useState } from "react";
import { fetchPropertiesByRouteId } from "@/actions/supabase/queries/routes";
import Banner from "@/components/Banner/Banner";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { Property } from "@/types/schema";
import {
  BackLink,
  ContentContainer,
  Header,
  PageContainer,
  PropertiesList,
  Tab,
  TabContainer,
} from "./styles";

export default function RoutePage({
  params,
}: {
  params: Promise<{ session_id: string; route_id: string }>;
}) {
  const { session_id, route_id } = use(params);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const props = await fetchPropertiesByRouteId(route_id);
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
  }, [session_id, route_id]);

  if (loading) return <p>Loading route...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer>
      <Banner />

      <BackLink href="/sessions">← Back to Sessions</BackLink>

      <ContentContainer>
        <Header>Central Hub Name</Header>

        <TabContainer>
          <Tab $active>Properties</Tab>
          <Tab>Route</Tab>
          <Tab>Group</Tab>
        </TabContainer>

        <PropertiesList>
          {properties.length === 0 ? (
            <p>No properties found for your route.</p>
          ) : (
            properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </PropertiesList>
      </ContentContainer>
    </PageContainer>
  );
}
