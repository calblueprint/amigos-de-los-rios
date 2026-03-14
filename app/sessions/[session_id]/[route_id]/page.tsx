"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchPropertiesByRouteId,
  fetchRouteById,
} from "@/actions/supabase/queries/routes";
import {
  assignUserToRoute,
  getAssignedUsersByRouteId,
  unassignUserFromRoute,
} from "@/actions/supabase/queries/routeUserAssignments";
import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import {
  checkUserOnboarded,
  getUserByEmail,
  getUserById,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { Route, RouteStop, User, WateringSession } from "@/types/schema";
import {
  AllContent,
  BackLink,
  ContentContainer,
  DotBlue,
  DotOrange,
  DotPurple,
  Header,
  HeaderContainer,
  LargeDotBlue,
  LargeDotOrange,
  LargeDotPurple,
  PageContainer,
  PropertiesCard,
  PropertiesHolder,
  PropertiesList,
  RouteContainer,
  RouteHeader,
  RouteHolder,
  RouteMap,
  RoutePoints,
  RouteType,
  RouteValue,
  RouteValueCard,
  RouteValueCardText,
  RouteValueVar,
  RouteValueVarNum,
  Tab,
  TabContainer,
  TeamAssignment,
  TeamAssignmentCard,
  TeamAssignmentName,
  TeamAssignmentRole,
  TeamAssignmentText,
  TeamContainer,
} from "./styles";

const API_KEY = process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY;

export default function RoutePage({
  params,
}: {
  params: Promise<{ session_id: string; route_id: string }>;
}) {
  const { session_id, route_id } = use(params);
  const { userId } = useAuth();
  const router = useRouter();
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [sessionInfo, setSessionInfo] = useState<WateringSession | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState("");

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
        setStops(props);

        const assigned = await getAssignedUsersByRouteId(route_id);
        setAssignedUsers(assigned);

        const route = await fetchRouteById(route_id);
        setRoute(route);

        const sessionInfo = await fetchSessionById(session_id);
        setSessionInfo(sessionInfo);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load route data",
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [session_id, route_id, userId, router]);

  async function handleAssign() {
    try {
      if (!emailInput) return;

      setAssignLoading(true);

      const user = await getUserByEmail(emailInput);

      const alreadyAssigned = assignedUsers.some(item => item.id === user.id);

      if (alreadyAssigned) {
        setEmailInput("");
        return;
      }

      await assignUserToRoute(route_id, user.id, session_id);

      const updated = await getAssignedUsersByRouteId(route_id);
      setAssignedUsers(updated);
      setEmailInput("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to assign user.";
      alert(errorMessage);
    } finally {
      setAssignLoading(false);
    }
  }

  async function handleUnassign(userId: string) {
    try {
      await unassignUserFromRoute(route_id, userId);
      const updated = await getAssignedUsersByRouteId(route_id);
      setAssignedUsers(updated);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unassign user.";
      alert(errorMessage);
    }
  }

  if (loading) return <p>Loading route...</p>;
  if (error) return <p>Error: {error}</p>;

  const backLink = isAdmin ? `/sessions/${session_id}` : "/sessions";
  const backLinkText = isAdmin ? "← Back to Routes" : "← Back to Sessions";

  const embedUrl = (() => {
    if (!route?.maps_link) return null;

    const url_params = new URL(route.maps_link).searchParams;

    const origin = url_params.get("origin");
    const destination = url_params.get("destination");
    const waypoints = url_params.get("waypoints");
    const mode = url_params.get("travelmode") ?? "driving";

    if (!origin || !destination) return null;

    const url = new URL("https://www.google.com/maps/embed/v1/directions");
    url.searchParams.set("key", API_KEY!);
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("mode", mode);
    if (waypoints) url.searchParams.set("waypoints", waypoints);

    return url.toString();
  })();

  return (
    <PageContainer>
      <Banner />

      <BackLink href={backLink}>{backLinkText}</BackLink>

      <AllContent>
        <ContentContainer>
          <HeaderContainer>
            <Header>
              {sessionInfo?.watering_event_name} — {route?.route_label}
            </Header>
            <RouteValue>
              <RouteValueCard>
                <img src="/images/distance_loc.svg" width="36" height="36" />
                <RouteValueCardText>
                  <RouteValueVar>Distance</RouteValueVar>
                  <RouteValueVarNum>3.2 km</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
              <RouteValueCard>
                <img src="/images/time_loc.svg" width="36" height="36" />
                <RouteValueCardText>
                  <RouteValueVar>Est. Time</RouteValueVar>
                  <RouteValueVarNum>2.5 hours</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
              <RouteValueCard>
                <img src="/images/tree_loc.svg" width="36" height="36" />
                <RouteValueCardText>
                  <RouteValueVar>Trees</RouteValueVar>
                  <RouteValueVarNum>4 points</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
              <RouteValueCard>
                <img src="/images/checkpoint_loc.svg" width="36" height="36" />
                <RouteValueCardText>
                  <RouteValueVar>Checkpoints</RouteValueVar>
                  <RouteValueVarNum>2 stops</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
            </RouteValue>
          </HeaderContainer>

          <RouteContainer>
            <RouteHeader>
              <RouteMap>Route Map</RouteMap>
              <RouteType>
                <DotOrange></DotOrange>
                Trees
                <DotBlue></DotBlue>
                Hydrants
                <DotPurple></DotPurple>
                Checkpoints
              </RouteType>
            </RouteHeader>
            <iframe
              width="800"
              height="400"
              loading="lazy"
              src={
                embedUrl ??
                `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=-34,151&zoom=8`
              }
            ></iframe>
            <RouteHolder>
              <RoutePoints>Route Points</RoutePoints>
              <PropertiesHolder>
                <PropertiesCard>
                  <LargeDotPurple></LargeDotPurple>
                </PropertiesCard>
              </PropertiesHolder>
              <PropertiesHolder>
                <PropertiesCard>
                  <LargeDotBlue></LargeDotBlue>
                </PropertiesCard>
              </PropertiesHolder>
              <PropertiesHolder>
                <PropertiesCard>
                  <LargeDotOrange></LargeDotOrange>
                </PropertiesCard>
              </PropertiesHolder>
            </RouteHolder>
          </RouteContainer>

          {/* temporary input styling */}
          {isAdmin && (
            <div style={{ marginBottom: "2rem" }}>
              <h3>Assign User to Route</h3>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  style={{ padding: "0.5rem", width: "250px" }}
                />

                <button onClick={handleAssign} disabled={assignLoading}>
                  {assignLoading ? "Assigning..." : "Assign"}
                </button>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <h4>Assigned Users</h4>

                {assignedUsers.length === 0 ? (
                  <p>No users assigned.</p>
                ) : (
                  assignedUsers.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem 0",
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong> — {item.email}
                      </div>

                      <button onClick={() => handleUnassign(item.id)}>
                        Unassign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <TabContainer>
            <Tab $active>Properties</Tab>
          </TabContainer>
          <PropertiesList>
            {stops.length === 0 ? (
              <p>No properties found for your route.</p>
            ) : (
              stops.map(stop => <PropertyCard key={stop.id} property={stop} />)
            )}
          </PropertiesList>
        </ContentContainer>
        <TeamContainer>
          <TeamAssignment>Team Assignment</TeamAssignment>
          <TeamAssignmentCard>
            <TeamAssignmentText>
              <TeamAssignmentName>Placeholder</TeamAssignmentName>
              <TeamAssignmentRole>Placeholder</TeamAssignmentRole>
            </TeamAssignmentText>
          </TeamAssignmentCard>
        </TeamContainer>
      </AllContent>
    </PageContainer>
  );
}
