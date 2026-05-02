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
  deleteSessionById,
  updateSession,
} from "@/actions/supabase/queries/sessions";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import MenuSidebar from "@/components/MenuSidebar/MenuSidebar";
import SessionCard from "@/components/SessionCard/SessionCard";
import WarningCard from "@/components/WarningCard/WarningCard";
import { IconSvgs } from "@/lib/icons";
import { WateringSession } from "@/types/schema";
import {
  AddButton,
  ButtonGroup,
  CancelButton,
  ControlsRow,
  EditButton,
  Header,
  HeaderSection,
  PageContainer,
  PastButton,
  SaveButton,
  SessionsList,
  SyncButton,
  Toast,
  ToggleContainer,
  UpcomingButton,
} from "./styles";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<WateringSession[]>([]);
  const [drafts, setDrafts] = useState<WateringSession[]>([]); // Holds unsaved edits
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

        const isOnboarded = await checkUserOnboarded(userId);
        if (!isOnboarded) {
          router.push("/account_details");
          return;
        }

        const userRow = await getUserById(userId);
        const adminStatus = userRow?.is_admin ?? false;
        setIsAdmin(adminStatus);

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
  }, [userId, router, authLoading]);

  const handleStartEditing = () => {
    setDrafts([...sessions]);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setDrafts([]);
    setIsEditing(false);
  };

  const handleDraftChange = (
    id: string,
    field: "date" | "watering_event_name",
    value: string,
  ) => {
    setDrafts(prev =>
      prev.map(draft =>
        draft.id === id ? { ...draft, [field]: value } : draft,
      ),
    );
  };

  const handleSaveDrafts = async () => {
    setIsSaving(true);
    try {
      const changedSessions = drafts.filter(draft => {
        const original = sessions.find(s => s.id === draft.id);
        return (
          original &&
          (original.date !== draft.date ||
            original.watering_event_name !== draft.watering_event_name)
        );
      });

      await Promise.all(
        changedSessions.map(draft =>
          updateSession(draft.id, {
            date: draft.date,
            watering_event_name: draft.watering_event_name,
          }),
        ),
      );

      setSessions(drafts);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save some changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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

  if (loading || authLoading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSessionById(sessionToDelete.id);

      setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      setDrafts(prev => prev.filter(s => s.id !== sessionToDelete.id));
      setSessionToDelete(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

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
              {isEditing ? (
                <>
                  <SaveButton onClick={handleSaveDrafts} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </SaveButton>
                  <CancelButton
                    onClick={handleCancelEditing}
                    disabled={isSaving}
                  >
                    Cancel
                  </CancelButton>
                </>
              ) : (
                <>
                  <SyncButton onClick={handleSync} disabled={syncing}>
                    <Image
                      src="/icons/syncicon.svg"
                      alt="Sync"
                      width={20}
                      height={20}
                      style={{
                        animation: syncing
                          ? "spin 0.7s linear infinite"
                          : "none",
                      }}
                    />
                  </SyncButton>

                  {showToast && toastType && (
                    <Toast>
                      {toastType === "success"
                        ? IconSvgs.sync_checkmark
                        : IconSvgs.sync_failure}
                      {toastType === "success"
                        ? "Data Fetched"
                        : "Fetch Failed"}
                    </Toast>
                  )}

                  <EditButton onClick={handleStartEditing}>
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
                </>
              )}
            </ButtonGroup>
          )}
        </ControlsRow>
      </HeaderSection>

      <SessionsList>
        {filteredSessions.map(session => {
          const displaySession = isEditing
            ? drafts.find(d => d.id === session.id) || session
            : session;
          return (
            <SessionCard
              key={session.id}
              session={displaySession}
              isEditing={isEditing}
              onDeleteClick={() => setSessionToDelete(session)}
              onDraftChange={handleDraftChange}
            />
          );
        })}
      </SessionsList>
      <WarningCard
        isOpen={sessionToDelete !== null}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
