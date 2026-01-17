"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRoutesBySessionId } from "@/actions/supabase/queries/routes";
import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import { checkUserOnboarded } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import RouteCard from "@/components/RouteCard/RouteCard";
import { Route, WateringSession } from "@/types/schema";
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
  const { userId } = useAuth();
  const router = useRouter();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<WateringSession | null>(null);

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

        // Load routes and session info
        const [routesData, sessionData] = await Promise.all([
          fetchRoutesBySessionId(session_id),
          fetchSessionById(session_id),
        ]);

        setRoutes(routesData);
        setSessionInfo(sessionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load routes");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [session_id, userId, router]);

  if (loading) return <p>Loading routes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer>
      <Banner />

      <BackLink href="/sessions">← Back to Sessions</BackLink>

      <ContentContainer>
        <CentralHubName>
          {sessionInfo?.watering_event_name ?? ""}
        </CentralHubName>
        <DateHeader>
          {sessionInfo?.date
            ? new Date(sessionInfo.date + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  timeZone: "America/Los_Angeles",
                },
              )
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
