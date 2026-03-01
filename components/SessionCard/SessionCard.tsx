"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "inspector/promises";
import { fetchUserRouteForSession } from "@/actions/supabase/queries/routes";
import { getUserById } from "@/actions/supabase/queries/users";
import { CentralHubName } from "@/app/sessions/[session_id]/styles";
import { useAuth } from "@/app/utils/AuthContext";
import { WateringSession } from "@/types/schema";
import {
  DeleteButton,
  SessionDate,
  SessionHeader,
  SessionHub,
  SessionImage,
  SessionInfo,
  SessionTitle,
  SessionCard as StyledSessionCard,
} from "./styles";

interface SessionCardProps {
  session: WateringSession;
}

export default function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();
  const { userId }: { userId?: string | null } = useAuth(); // use in actual app
  // const userId = "d95d9650-f070-497d-9414-c4e0c4d8f9d3"; // testing admin user
  // const userId = "e6ff979c-16ad-49fe-aab7-5eca3eec04c5"; // testing volunteer w/ route

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadUserRole() {
      if (!userId) return; // not logged in yet

      const userRow = await getUserById(userId);
      setIsAdmin(userRow?.is_admin ?? false);
    }

    loadUserRole();
  }, [userId]);

  const handleClick = async () => {
    if (isAdmin === null) return;

    if (isAdmin) {
      router.push(`/sessions/${session.id}`);
      return;
    }

    try {
      const route_id = await fetchUserRouteForSession(userId!, session.id);
      router.push(`/sessions/${session.id}/${route_id}`);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering handleClick
    // TODO: Implement delete functionality
    console.log("Delete session", session.id);
  };

  return (
    <StyledSessionCard onClick={handleClick} style={{ cursor: "pointer" }}>
      <SessionImage src="/campanile.svg" alt="Session" />

      <SessionInfo>
        <SessionHeader>
          <SessionDate>
            {session.central_hub},{" "}
            {new Date(session.date + "T00:00:00").toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              timeZone: "America/Los_Angeles",
            })}
          </SessionDate>

          <DeleteButton onClick={handleDelete}>
            <img src="/icons/delete.svg" alt="Delete" />
          </DeleteButton>
        </SessionHeader>
        <SessionTitle>Central Hub Address</SessionTitle>
        <SessionHub>{session.watering_event_name}</SessionHub>
      </SessionInfo>
    </StyledSessionCard>
  );
}
