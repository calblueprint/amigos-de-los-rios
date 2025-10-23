"use client";

import { useEffect, useState } from "react";
import supabase from "@/actions/supabase/client";
import {
  AddButton,
  Banner,
  ButtonGroup,
  EditButton,
  HeaderSection,
  Logo,
  PageContainer,
  SessionCard,
  SessionDate,
  SessionHub,
  SessionImage,
  SessionInfo,
  SessionsList,
  SessionTitle,
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
    async function fetchSessions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Watering Sessions")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;
        setSessions(data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
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
          <SessionCard key={session.id}>
            <SessionImage src="campanile.svg" alt="Session" />
            <SessionInfo>
              <SessionDate>
                {new Date(session.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </SessionDate>
              <SessionHub>{session.central_hub}</SessionHub>
              <SessionTitle>{session.watering_event_name}</SessionTitle>
            </SessionInfo>
          </SessionCard>
        ))}
      </SessionsList>
    </PageContainer>
  );
}
