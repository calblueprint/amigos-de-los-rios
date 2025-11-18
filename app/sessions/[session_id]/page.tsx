"use client";

import { use, useEffect, useState } from "react";
import { fetchRoutesBySessionId } from "@/actions/supabase/queries/routes";
import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import Banner from "@/components/Banner/Banner";
import RouteCard from "@/components/RouteCard/RouteCard";
import { Route } from "@/types/schema";
import {
  BackLink,
  CentralHubName,
  ContentContainer,
  DateHeader,
  PageContainer,
  RoutesHeader,
  RoutesList,
} from "./styles";

export default function SessionRoutesPage({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id } = use(params);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<{
    central_hub: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    async function loadRoutes() {
      try {
        setLoading(true);
        const result = await fetchRoutesBySessionId(session_id);
        setRoutes(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load routes");
      } finally {
        setLoading(false);
      }
    }

    loadRoutes();
  }, [session_id]);

  useEffect(() => {
    async function loadSession() {
      const session = await fetchSessionById(session_id);
      setSessionInfo(session);
    }
    loadSession();
  }, [session_id]);

  if (loading) return <p>Loading routes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer>
      <Banner />

      <BackLink href="/sessions">← Back to Sessions</BackLink>

      <ContentContainer>
        <CentralHubName>
          {sessionInfo?.central_hub ?? "Central Hub"}
        </CentralHubName>
        <DateHeader>
          {sessionInfo?.date
            ? new Date(sessionInfo.date).toLocaleDateString("en-GB", {
                day: "2-digit", // Thursday
                month: "long", // November
              }) + `, ${new Date(sessionInfo.date).toLocaleDateString("en-GB")}`
            : "Date"}
        </DateHeader>
        <RoutesHeader>Routes</RoutesHeader>

        <RoutesList>
          {routes.length === 0 ? (
            <p>No routes found for this session.</p>
          ) : (
            routes.map(route => (
              <RouteCard key={route.id} route={route} sessionId={session_id} />
            ))
          )}
        </RoutesList>
      </ContentContainer>
    </PageContainer>
  );
}
