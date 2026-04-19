"use client";

import { use, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  fetchPropertiesByRouteId,
  fetchRouteById,
  getGroupLeaderId,
  updateGroupLeader,
} from "@/actions/supabase/queries/routes";
import {
  assignUserToRoute,
  getAssignedUsersByRouteId,
  unassignUserFromRoute,
} from "@/actions/supabase/queries/routeUserAssignments";
import { fetchSessionById } from "@/actions/supabase/queries/sessions";
import {
  checkUserOnboarded,
  getUserById,
  searchUsersInDatabase,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import VolunteerCard from "@/components/VolunteerCard/VolunteerCard";
import VolunteerCardSearch from "@/components/VolunteerCardSearch/VolunteerCardSearch";
import VolunteerEmailCard from "@/components/VolunteerEmailCard/VolunteerEmailCard";
import VolunteerEmailCardSearch from "@/components/VolunteerEmailCardSearch/VolunteerEmailCardSearch";
import { Route, RouteStop, User, WateringSession } from "@/types/schema";
import {
  AllContent,
  AssignedUsers,
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
  PrintButton,
  PrintHeader,
  PropertiesCard,
  PropertiesHolder,
  PropertiesList,
  PublishButton,
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
  SearchContainer,
  SearchInput,
  SearchMessage,
  SearchResultsDropdown,
  Tab,
  TabContainer,
  TeamAssignment,
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
  const [officialUsers, setOfficialUsers] = useState<User[]>([]);
  const [draftUsers, setDraftUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [sessionInfo, setSessionInfo] = useState<WateringSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [officialGroupLeaderId, setOfficialGroupLeaderId] = useState<
    string | null
  >(null);
  const [draftGroupLeaderId, setDraftGroupLeaderId] = useState<string | null>(
    null,
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const hasUnpublishedChanges =
    JSON.stringify(draftUsers) !== JSON.stringify(officialUsers) ||
    draftGroupLeaderId !== officialGroupLeaderId;

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${sessionInfo?.watering_event_name || "Route"}-${route?.route_label || "Details"}`,
  });

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

        const userRow = await getUserById(userId);
        setIsAdmin(userRow?.is_admin ?? false);

        const props = await fetchPropertiesByRouteId(route_id);
        setStops(props);

        const assigned = await getAssignedUsersByRouteId(route_id);
        setDraftUsers(assigned);
        setOfficialUsers(assigned);

        const leaderId = await getGroupLeaderId(route_id);
        setOfficialGroupLeaderId(leaderId);
        setDraftGroupLeaderId(leaderId);

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const fetchedUsers = await searchUsersInDatabase(searchQuery);
        const availableUsers = fetchedUsers.filter(
          dbUser => !draftUsers.some(draftUser => draftUser.id === dbUser.id),
        );

        setSearchResults(availableUsers);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, draftUsers]);

  function handleAssignFromSearch(user: User) {
    setDraftUsers(prev => [...prev, user]);
    setSearchQuery("");
    setSearchResults([]);
  }

  function handleAssignNewEmail(email: string) {
    const pendingUser = {
      id: `pending-${email}`,
      name: email.split("@")[0],
      email: email,
      affiliation: "Pending Invitation",
      is_admin: false,
    } as User;

    setDraftUsers(prev => [...prev, pendingUser]);
    setSearchQuery("");
    setSearchResults([]);
  }

  async function handlePublish() {
    try {
      setIsPublishing(true);

      const usersToRemove = officialUsers.filter(
        officialUser =>
          !draftUsers.some(draftUser => draftUser.id === officialUser.id),
      );

      const usersToAdd = draftUsers.filter(
        draftUser =>
          !officialUsers.some(officialUser => officialUser.id === draftUser.id),
      );

      const realUsersToAdd = usersToAdd.filter(
        u => !u.id.startsWith("pending-"),
      );
      const pendingEmailsToInvite = usersToAdd.filter(u =>
        u.id.startsWith("pending-"),
      );

      for (const user of usersToRemove) {
        await unassignUserFromRoute(route_id, user.id);
      }

      for (const user of realUsersToAdd) {
        await assignUserToRoute(route_id, user.id, session_id);
      }

      if (draftGroupLeaderId !== officialGroupLeaderId) {
        await updateGroupLeader(route_id, draftGroupLeaderId);
      }

      setOfficialUsers([...draftUsers]);
      setOfficialGroupLeaderId(draftGroupLeaderId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish changes.";
      alert(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleUnassign(userId: string) {
    try {
      setDraftUsers(prev => prev.filter(user => user.id !== userId));

      if (draftGroupLeaderId === userId) {
        setDraftGroupLeaderId(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unassign user.";
      alert(errorMessage);
    }
  }

  function handleGroupLeader(userId: string) {
    setDraftGroupLeaderId(prev => (prev === userId ? null : userId));
  }

  if (loading) return <p>Loading route...</p>;
  if (error) return <p>Error: {error}</p>;

  const backLink = isAdmin ? `/sessions/${session_id}` : "/sessions";
  const backLinkText = isAdmin ? "← Back to Routes" : "← Back to Sessions";

  const embedUrl = (route: Route | null) => {
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
  };

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
                <Image
                  src="/images/distance_loc.svg"
                  width={36}
                  height={36}
                  alt="Distance icon"
                />
                <RouteValueCardText>
                  <RouteValueVar>Distance</RouteValueVar>
                  <RouteValueVarNum>3.2 km</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
              <RouteValueCard>
                <Image
                  src="/images/time_loc.svg"
                  width={36}
                  height={36}
                  alt="Estimated time icon"
                />
                <RouteValueCardText>
                  <RouteValueVar>Est. Time</RouteValueVar>
                  <RouteValueVarNum>2.5 hours</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
              <RouteValueCard>
                <Image
                  src="/images/tree_loc.svg"
                  width={36}
                  height={36}
                  alt="Tree points icon"
                />
                <RouteValueCardText>
                  <RouteValueVar>Trees</RouteValueVar>
                  <RouteValueVarNum>4 points</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
              <RouteValueCard>
                <Image
                  src="/images/checkpoint_loc.svg"
                  width={36}
                  height={36}
                  alt="Checkpoints icon"
                />
                <RouteValueCardText>
                  <RouteValueVar>Checkpoints</RouteValueVar>
                  <RouteValueVarNum>2 stops</RouteValueVarNum>
                </RouteValueCardText>
              </RouteValueCard>
            </RouteValue>
          </HeaderContainer>

          <RouteContainer ref={printRef}>
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
                embedUrl(route) ??
                `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=-34,151&zoom=8`
              }
            ></iframe>
            <RouteHolder>
              <RoutePoints>
                <span>Route Points</span>
                <PrintHeader>
                  <PrintButton onClick={() => handlePrint()}>
                    <Image
                      src="/images/print.svg"
                      width={16.138}
                      height={13.833}
                      alt="Print"
                    />
                  </PrintButton>
                  Print Route
                </PrintHeader>
              </RoutePoints>

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
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search by name, email, or affiliation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <SearchResultsDropdown>
                {isSearching ? (
                  <SearchMessage>Searching...</SearchMessage>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div
                      key={user.id}
                      onClick={() => handleAssignFromSearch(user)}
                      style={{
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <VolunteerCardSearch
                        name={user.name}
                        organization={user.affiliation}
                        email={user.email}
                      />
                    </div>
                  ))
                ) : searchQuery.includes("@") ? (
                  <div
                    onClick={() => handleAssignNewEmail(searchQuery)}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <VolunteerEmailCardSearch
                      name={searchQuery.split("@")[0]}
                      email={searchQuery}
                    />
                  </div>
                ) : (
                  <SearchMessage>No volunteers found</SearchMessage>
                )}
              </SearchResultsDropdown>
            )}
          </SearchContainer>

          <AssignedUsers>Assigned Team ({draftUsers.length})</AssignedUsers>

          {[...draftUsers]
            .sort(
              (a, b) =>
                Number(b.id === draftGroupLeaderId) -
                Number(a.id === draftGroupLeaderId),
            )
            .map(user => {
              if (user.id.startsWith("pending-")) {
                return (
                  <VolunteerEmailCard
                    key={user.id}
                    name={user.name}
                    email={user.email}
                    isAdmin={isAdmin}
                    isGroupLeader={user.id === draftGroupLeaderId}
                    onMakeLeader={() => handleGroupLeader(user.id)}
                    onUnassign={() => handleUnassign(user.id)}
                  />
                );
              }

              return (
                <VolunteerCard
                  key={user.id}
                  name={user.name}
                  organization={user.affiliation}
                  email={user.email}
                  isAdmin={isAdmin}
                  isGroupLeader={user.id === draftGroupLeaderId}
                  onMakeLeader={() => handleGroupLeader(user.id)}
                  onUnassign={() => handleUnassign(user.id)}
                />
              );
            })}

          <PublishButton
            $hasChanges={hasUnpublishedChanges}
            onClick={handlePublish}
            disabled={!hasUnpublishedChanges || isPublishing}
          >
            Publish Team
          </PublishButton>
        </TeamContainer>
      </AllContent>
    </PageContainer>
  );
}
