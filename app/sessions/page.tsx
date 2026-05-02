"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
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
import MenuSidebar from "@/components/MenuSidebar/MenuSidebar";
import SessionCard from "@/components/SessionCard/SessionCard";
import { IconSvgs } from "@/lib/icons";
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
  SyncButton,
  Toast,
  ToggleContainer,
  UpcomingButton,
} from "./styles";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<WateringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, loading: authLoading } = useAuth();
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
  const filteredSessions = sessions
    .filter(session => {
      const sessionDate = session.date;
      const now = new Date().toISOString().split("T")[0];
      return filterState === "Upcoming"
        ? sessionDate >= now
        : sessionDate < now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (filterState === "Upcoming") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

  if (loading || authLoading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSync = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    setSyncing(true);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error("Sync failed");
      setToastType("success");
    } catch (err) {
      console.log("Sync error:", err);
      setToastType("error");
    } finally {
      setSyncing(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setToastType(null);
      }, 5000);
    }
  };

  return (
    <PageContainer>
      <MenuSidebar />
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
              <SyncButton onClick={handleSync} disabled={syncing}>
                <Image
                  src="/icons/syncicon.svg"
                  alt="Sync"
                  width={20}
                  height={20}
                  style={{
                    animation: syncing ? "spin 0.7s linear infinite" : "none",
                  }}
                />
              </SyncButton>

              {showToast && toastType && (
                <Toast>
                  {toastType === "success"
                    ? IconSvgs.sync_checkmark
                    : IconSvgs.sync_failure}
                  {toastType === "success" ? "Data Fetched" : "Fetch Failed"}
                </Toast>
              )}

              <EditButton>
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
          <SessionCard key={session.id} session={session} />
        ))}
      </SessionsList>
    </PageContainer>
  );
}
