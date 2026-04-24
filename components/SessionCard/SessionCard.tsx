"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchUserRouteForSession } from "@/actions/supabase/queries/routes";
import { updateSession } from "@/actions/supabase/queries/sessions";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { WateringSession } from "@/types/schema";
import {
  DateInput, // ADDED
  DeleteButton,
  NameInput, // ADDED
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
  onUpdate?: (updatedSession: WateringSession) => void;
}

export default function SessionCard({
  session,
  isEditing,
  onDeleteClick,
  onUpdate,
}: SessionCardProps) {
  const router = useRouter();
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [editedDate, setEditedDate] = useState(session.date);
  const [editedName, setEditedName] = useState(session.central_hub);

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

  const handleDateBlur = async () => {
    if (editedDate === session.date) return;
    try {
      await updateSession(session.id, { date: editedDate });
      if (onUpdate) onUpdate({ ...session, date: editedDate });
    } catch (err) {
      console.error("Failed to update date", err);
      setEditedDate(session.date);
    }
  };

  const handleNameBlur = async () => {
    if (editedName === session.central_hub) return;
    try {
      await updateSession(session.id, { central_hub: editedName });
      if (onUpdate) onUpdate({ ...session, central_hub: editedName });
    } catch (err) {
      console.error("Failed to update name", err);
      setEditedName(session.central_hub);
    }
  };

  return (
    <StyledSessionCard onClick={handleClick} $isEditing={isEditing}>
      <SessionDateCard>
        {isEditing ? (
          <DateInput
            type="date"
            value={editedDate}
            onChange={e => setEditedDate(e.target.value)}
            onBlur={handleDateBlur}
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

      <SessionInfo>
        <SessionHeader>
          {isEditing ? (
            <NameInput
              type="text"
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              onBlur={handleNameBlur}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <SessionName>{session.central_hub}</SessionName>
          )}

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

          <SessionTitle>Central Hub Address</SessionTitle>
          <SessionHub>{session.watering_event_name}</SessionHub>
        </SessionHeader>
      </SessionInfo>
    </StyledSessionCard>
  );
}
