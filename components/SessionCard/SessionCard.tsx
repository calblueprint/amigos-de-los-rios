"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserRouteForSession } from "@/actions/supabase/queries/routes";
import { getUserById } from "@/actions/supabase/queries/users";
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
            {new Date(session.date + "T00:00:00").toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "America/Los_Angeles",
            })}
          </SessionDate>
          <DeleteButton onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12 4L4 12"
                stroke="#707070"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 4L12 12"
                stroke="#707070"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </DeleteButton>
        </SessionHeader>
        <SessionHub>{session.central_hub}</SessionHub>
        <SessionTitle>Property Address</SessionTitle>
      </SessionInfo>
    </StyledSessionCard>
  );
}
