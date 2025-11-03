"use client";

import { useEffect, useState } from "react";
import { fetchSessions } from "@/actions/supabase/queries/routes";
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
      <Banner />

      <HeaderSection>
        <Header>Sessions</Header>
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
