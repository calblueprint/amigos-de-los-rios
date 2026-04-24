"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  fetchAllSessionsForUser,
  fetchSessions,
} from "@/actions/supabase/queries/routes";
import { deleteSessionById } from "@/actions/supabase/queries/sessions";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import SessionCard from "@/components/SessionCard/SessionCard";
import WarningCard from "@/components/WarningCard/WarningCard";
import { WateringSession } from "@/types/schema";
import {
  AddButton,
  ButtonGroup,
  ControlsRow,
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
  const [isEditing, setIsEditing] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState<WateringSession | null>(null);

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
  const filteredSessions = sessions
    .filter(session => {
      const sessionDate = session.date;
      const todayObj = new Date();
      const year = todayObj.getFullYear();
      const month = String(todayObj.getMonth() + 1).padStart(2, "0");
      const day = String(todayObj.getDate()).padStart(2, "0");
      const localNow = `${year}-${month}-${day}`;

      return filterState === "Upcoming"
        ? sessionDate >= localNow
        : sessionDate < localNow;
    })
    .sort((a, b) => {
      if (filterState === "Upcoming") {
        return a.date.localeCompare(b.date);
      } else {
        return b.date.localeCompare(a.date);
      }
    });

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading || authLoading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSessionById(sessionToDelete.id);

      setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      setSessionToDelete(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

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
        <ControlsRow>
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
          {isAdmin && (
            <ButtonGroup>
              <EditButton onClick={() => setIsEditing(!isEditing)}>
                {" "}
                <Image
                  src="/icons/editicon.svg"
                  alt="Edit"
                  width={20}
                  height={20}
                />
              </EditButton>
              <AddButton href="/sessions/new_session">
                <Image
                  src="/icons/addicon.svg"
                  alt="Add"
                  width={30}
                  height={30}
                />
              </AddButton>
            </ButtonGroup>
          )}
        </ControlsRow>
      </HeaderSection>

      <SessionsList>
        {filteredSessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            isEditing={isEditing}
            onDeleteClick={() => setSessionToDelete(session)}
            onUpdate={updatedSession => {
              setSessions(prev =>
                prev.map(s =>
                  s.id === updatedSession.id ? updatedSession : s,
                ),
              );
            }}
          />
        ))}
      </SessionsList>
      <WarningCard
        isOpen={sessionToDelete !== null}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
