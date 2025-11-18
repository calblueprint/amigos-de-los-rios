"use client";

import { useEffect, useState } from "react";
import {
  fetchAllSessionsForUser,
  fetchSessions,
} from "@/actions/supabase/queries/routes";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import SessionCard from "@/components/SessionCard/SessionCard";
import {
  AddButton,
  ButtonGroup,
  EditButton,
  Header,
  HeaderSection,
  PageContainer,
  SessionsList,
} from "./styles";

type WateringSession = {
  id: string;
  date: string;
  watering_event_name: string;
  central_hub: string;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<WateringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId }: { userId?: string | null } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        if (!userId) return; // Guard against no userId

        // First, load the user role
        const userRow = await getUserById(userId);
        const adminStatus = userRow?.is_admin ?? false;
        setIsAdmin(adminStatus);

        // Then, load sessions based on role
        if (isAdmin) {
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
  }, [userId, isAdmin]); // Add userId as dependency

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer>
      <Banner />

      <HeaderSection>
        <Header>Sessions</Header>
        {isAdmin && (
          <ButtonGroup>
            <AddButton>+ Add</AddButton>
            <EditButton>Edit</EditButton>
          </ButtonGroup>
        )}
      </HeaderSection>

      <SessionsList>
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </SessionsList>
    </PageContainer>
  );
}
