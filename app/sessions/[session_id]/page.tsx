"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteRouteById,
  fetchRoutesBySessionId,
} from "@/actions/supabase/queries/routes";
import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import { checkUserOnboarded } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import LegendCard from "@/components/LegendCard/LegendCard";
import RouteCard from "@/components/RouteCard/RouteCard";
import WarningCard from "@/components/WarningCard/WarningCard";
import { IconSvgs } from "@/lib/icons";
import { Route, WateringSession } from "@/types/schema";
import {
  BackLink,
  CentralHubName,
  ContentContainer,
  DateHeader,
  LegendDropdownWrapper,
  LegendIconButton,
  PageContainer,
  PrintAllButton,
  RoutesButtonContainer,
  RoutesHeader,
  RoutesHeaderContainer,
  RoutesList,
  TrashIconButton,
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        if (!userId) {
          router.push("/login");
          return;
        }
        const isOnboarded = await checkUserOnboarded(userId);
        if (!isOnboarded) {
          router.push("/account_details");
          return;
        }
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

  const handleConfirmDelete = async () => {
    if (!routeToDelete) return;
    try {
      await deleteRouteById(routeToDelete.id);
      setRoutes(prevRoutes =>
        prevRoutes.filter(route => route.id !== routeToDelete.id),
      );
      setRouteToDelete(null);
    } catch (err) {
      console.error("Failed to delete route:", err);
    }
  };

  if (loading) return <p>Loading routes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
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
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    timeZone: "America/Los_Angeles",
                  },
                )
              : "Date"}{" "}
            <div>{sessionInfo?.central_hub}</div>
          </DateHeader>

          <RoutesHeaderContainer>
            <RoutesHeader>Routes</RoutesHeader>
            <RoutesButtonContainer>
              <LegendIconButton onClick={() => setShowLegend(!showLegend)}>
                {IconSvgs.legend}
              </LegendIconButton>
              <PrintAllButton>{IconSvgs.print} Print All Routes</PrintAllButton>
              <TrashIconButton onClick={() => setIsDeleting(!isDeleting)}>
                {IconSvgs.trash}
              </TrashIconButton>
              {showLegend && (
                <>
                  <div
                    onClick={() => setShowLegend(false)}
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 99,
                    }}
                  />
                  <LegendDropdownWrapper>
                    <LegendCard />
                  </LegendDropdownWrapper>
                </>
              )}
            </RoutesButtonContainer>
          </RoutesHeaderContainer>

          <RoutesList>
            {routes.length === 0 ? (
              <p>No routes found for this session.</p>
            ) : (
              routes.map(route => (
                <RouteCard
                  key={route.id}
                  route={route}
                  sessionId={session_id}
                  isDeleting={isDeleting}
                  onDeleteClick={() => setRouteToDelete(route)}
                />
              ))
            )}
          </RoutesList>
        </ContentContainer>
      </PageContainer>

      <WarningCard
        isOpen={routeToDelete !== null}
        onClose={() => setRouteToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
