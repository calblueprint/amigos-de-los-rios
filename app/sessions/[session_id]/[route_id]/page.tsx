"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPropertiesByRouteId } from "@/actions/supabase/queries/routes";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
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
  const { userId } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        // Check authentication and onboarding
        if (!userId) {
          router.push("/login");
          return;
        }

        const isOnboarded = await checkUserOnboarded(userId);
        if (!isOnboarded) {
          router.push("/account_details");
          return;
        }

        // Load user role
        const userRow = await getUserById(userId);
        setIsAdmin(userRow?.is_admin ?? false);

        // Load properties
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

    init();
  }, [session_id, route_id, userId, router]);

  if (loading) return <p>Loading route...</p>;
  if (error) return <p>Error: {error}</p>;

  const backLink = isAdmin ? `/sessions/${session_id}` : "/sessions";

  return (
    <PageContainer>
      <Banner />

      <BackLink href={backLink}>← Back to Sessions</BackLink>

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
