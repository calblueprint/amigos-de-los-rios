"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserRouteForSession } from "@/actions/supabase/queries/routes";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { WateringSession } from "@/types/schema";
import {
  SessionDate,
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

  return (
    <StyledSessionCard onClick={handleClick} style={{ cursor: "pointer" }}>
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
        <SessionTitle>Property Address</SessionTitle>
      </SessionInfo>
    </StyledSessionCard>
  );
}
