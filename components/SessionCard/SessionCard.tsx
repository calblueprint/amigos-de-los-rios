"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchUserRouteForSession } from "@/actions/supabase/queries/routes";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { WateringSession } from "@/types/schema";
import {
  BorderLine,
  DateInput,
  DeleteButton,
  NameInput,
  SessionDateCard,
  SessionDateDay,
  SessionDateMonth,
  SessionHeader,
  SessionHub,
  SessionInfo,
  SessionName,
  SessionTitle,
  SessionCard as StyledSessionCard,
} from "./styles";

interface SessionCardProps {
  session: WateringSession;
  isEditing?: boolean;
  onDeleteClick?: () => void;
  onDraftChange?: (
    id: string,
    field: "date" | "watering_event_name",
    value: string,
  ) => void;
}

export default function SessionCard({
  session,
  isEditing,
  onDeleteClick,
  onDraftChange,
}: SessionCardProps) {
  const router = useRouter();
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadUserRole() {
      if (!userId) return;
      const userRow = await getUserById(userId);
      setIsAdmin(userRow?.is_admin ?? false);
    }
    loadUserRole();
  }, [userId]);

  const handleClick = async () => {
    if (isAdmin === null || isEditing) return;

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
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) onDeleteClick();
  };

  return (
    <StyledSessionCard onClick={handleClick} $isEditing={isEditing}>
      <SessionDateCard>
        {isEditing ? (
          <DateInput
            type="date"
            value={session.date}
            onChange={e => onDraftChange?.(session.id, "date", e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <>
            <SessionDateDay>
              {new Date(session.date + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  day: "2-digit",
                },
              )}
            </SessionDateDay>
            <SessionDateMonth>
              {new Date(session.date + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  month: "short",
                },
              )}
            </SessionDateMonth>
          </>
        )}
      </SessionDateCard>

      <BorderLine></BorderLine>

      <SessionInfo>
        <SessionHeader>
          <SessionName>{session.central_hub}</SessionName>

          {isEditing && (
            <DeleteButton onClick={handleDelete}>
              <Image
                src="/icons/delete.svg"
                alt="Delete"
                width={18}
                height={18}
              />
            </DeleteButton>
          )}

          <SessionTitle>
            {session.central_hub_address || "Central Hub Address"}
          </SessionTitle>

          {isEditing ? (
            <NameInput
              type="text"
              value={session.watering_event_name}
              onChange={e =>
                onDraftChange?.(
                  session.id,
                  "watering_event_name",
                  e.target.value,
                )
              }
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <SessionHub>{session.watering_event_name}</SessionHub>
          )}
        </SessionHeader>
      </SessionInfo>
    </StyledSessionCard>
  );
}
