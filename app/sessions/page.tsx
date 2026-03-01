"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllSessionsForUser,
  fetchSessions,
} from "@/actions/supabase/queries/routes";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import SessionCard from "@/components/SessionCard/SessionCard";
import { WateringSession } from "@/types/schema";
import {
  AddButton,
  ButtonGroup,
  EditButton,
  Header,
  HeaderSection,
  PageContainer,
  PastButton,
  SessionsList,
  SignOutButton,
  ToggleContainer,
  UpcomingButton,
} from "./styles";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<WateringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [filterState, setFilterState] = useState<"Upcoming" | "Past">(
    "Upcoming",
  );
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);

        // Wait for auth to finish loading
        if (authLoading) return;

        if (!userId) {
          router.push("/login");
          return;
        }

        // Check if user has completed onboarding
        const isOnboarded = await checkUserOnboarded(userId);
        if (!isOnboarded) {
          router.push("/account_details");
          return;
        }

        // Load the user role
        const userRow = await getUserById(userId);
        const adminStatus = userRow?.is_admin ?? false;
        setIsAdmin(adminStatus);

        // Load sessions based on role
        if (adminStatus) {
          const data = await fetchSessions();
          setSessions(data);
        } else {
          const data = await fetchAllSessionsForUser(userId);
          setSessions(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load sessions",
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [userId, router, authLoading]); // Remove isAdmin from dependencies to prevent infinite loop

  // Filter sessions based on selected date filter
  const filteredSessions = sessions.filter(session => {
    const sessionDate = session.date;
    const now = new Date().toISOString().split("T")[0];
    return filterState === "Upcoming" ? sessionDate >= now : sessionDate < now;
  });

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading || authLoading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer>
      <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
      <Banner />

      <HeaderSection>
        <Header>
          {isAdmin === null
            ? "Sessions"
            : isAdmin
              ? "Sessions [Admin View]"
              : "Sessions [Volunteer View]"}
        </Header>
        {isAdmin && (
          <ButtonGroup>
            <AddButton href="/sessions/new_session">+ Add</AddButton>
            <EditButton>Edit</EditButton>
          </ButtonGroup>
        )}

        <ToggleContainer>
          <UpcomingButton
            $active={filterState === "Upcoming"}
            onClick={() => setFilterState("Upcoming")}
          >
            Upcoming
          </UpcomingButton>
          <PastButton
            $active={filterState === "Past"}
            onClick={() => setFilterState("Past")}
          >
            Past
          </PastButton>
        </ToggleContainer>
      </HeaderSection>

      <SessionsList>
        {filteredSessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </SessionsList>
    </PageContainer>
  );
}
