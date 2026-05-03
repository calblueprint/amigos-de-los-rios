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
  EmptyStateText,
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

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

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
        <Header>{isAdmin ? "Sessions [Admin View]" : "Sessions"}</Header>
        {isAdmin && (
          <ButtonGroup>
            <AddButton href="/sessions/new_session">+ Add</AddButton>
            <EditButton>Edit</EditButton>
          </ButtonGroup>
        )}
        {!isAdmin && (
          <ToggleContainer>
            <UpcomingButton
              $active={activeTab === "upcoming"}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </UpcomingButton>
            <PastButton
              $active={activeTab === "past"}
              onClick={() => setActiveTab("past")}
            >
              Past
            </PastButton>
          </ToggleContainer>
        )}
      </HeaderSection>

      <SessionsList>
        {(() => {
          const today = new Date().toISOString().split("T")[0];
          const filtered = isAdmin
            ? sessions
            : sessions.filter(s =>
                activeTab === "upcoming" ? s.date >= today : s.date < today,
              );
          if (filtered.length === 0 && !isAdmin) {
            return (
              <EmptyStateText>
                You are currently not assigned to any watering sessions. Please
                contact Amigos De Los Rios at volunteer@amigosdelosrios.org if
                this is a mistake.
              </EmptyStateText>
            );
          }
          return filtered.map(session => (
            <SessionCard key={session.id} session={session} />
          ));
        })()}
      </SessionsList>
    </PageContainer>
  );
}
