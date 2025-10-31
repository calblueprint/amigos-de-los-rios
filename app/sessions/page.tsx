"use client";

import { useEffect, useState } from "react";
import { fetchSessions } from "@/actions/supabase/queries/routes";
import SessionCard from "@/components/SessionCard/SessionCard";
import {
  AddButton,
  Banner,
  ButtonGroup,
  EditButton,
  HeaderSection,
  Logo,
  PageContainer,
  SessionsList,
  Title,
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

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const data = await fetchSessions();
        setSessions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load sessions",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer>
      <Banner>
        <Logo src="/amigos-logo.png" alt="Amigos de los Rios logo" />
      </Banner>

      <HeaderSection>
        <Title>Sessions</Title>
        <ButtonGroup>
          <AddButton>+ Add</AddButton>
          <EditButton>Edit</EditButton>
        </ButtonGroup>
      </HeaderSection>

      <SessionsList>
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </SessionsList>
    </PageContainer>
  );
}
