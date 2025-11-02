"use client";

import {
  SessionDate,
  SessionHub,
  SessionImage,
  SessionInfo,
  SessionTitle,
  SessionCard as StyledSessionCard,
} from "./styles";

type WateringSession = {
  id: string;
  date: string;
  watering_event_name: string;
  central_hub: string;
};

interface SessionCardProps {
  session: WateringSession;
}

export default function SessionCard({ session }: SessionCardProps) {
  return (
    <StyledSessionCard>
      <SessionImage src="/campanile.svg" alt="Session" />
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
    </StyledSessionCard>
  );
}
