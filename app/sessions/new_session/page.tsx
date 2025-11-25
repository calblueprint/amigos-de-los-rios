"use client";

import React, { useEffect, useState } from "react";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import TeamCard from "@/components/TeamCard/TeamCard";
import { IconSvgs } from "@/lib/icons";
import { Team } from "@/types/schema";
import {
  AddButton,
  BackLink,
  ContentContainer,
  Divider,
  EditTeamsHeader,
  GenerateButton,
  Input,
  Label,
  NoTeams,
  PageContainer,
  TeamsContainer,
  Title,
} from "./styles";

export default function NewSession() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        if (!userId) return;

        const userRow = await getUserById(userId);
        const adminStatus = userRow?.is_admin ?? false;
        setIsAdmin(adminStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [userId, isAdmin]);

  const addTeam = () => {
    setTeams([...teams, { type: "Type A", size: 5, time: "1 hour" }]);
  };

  const onEdit = () => {
    console.log("edit");
  };

  const deleteTeam = (removedIndex: number) => {
    setTeams(teams.filter((_, index) => index !== removedIndex));
  };

  if (loading) return <p>Loading page...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!isAdmin) {
    return (
      <PageContainer style={{ padding: "40px", textAlign: "center" }}>
        <h2>401 unauthorized</h2>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Banner />
      <BackLink href="/sessions">← Back to Sessions</BackLink>

      <ContentContainer>
        <Title>Create Session</Title>

        <Label>
          Session Name<span className="required">*</span>
        </Label>
        <Input placeholder="Enter session name here" />

        <Label>
          Central Hub<span className="required">*</span>
        </Label>
        <Input placeholder="Enter central hub name" />

        <Label>
          Date<span className="required">*</span>
        </Label>
        <Input type="date" placeholder="MM/DD/YYYY" />

        <EditTeamsHeader>
          <Label>Edit Teams</Label>

          <AddButton>
            {React.cloneElement(IconSvgs.add, {
              onClick: addTeam,
              style: { cursor: "pointer" },
            })}
          </AddButton>
        </EditTeamsHeader>

        <TeamsContainer>
          {teams.length === 0 ? (
            <NoTeams>No teams made.</NoTeams>
          ) : (
            teams.map((team, index) => (
              <TeamCard
                key={index}
                team={team}
                onDelete={() => deleteTeam(index)}
              />
            ))
          )}
        </TeamsContainer>

        {teams.length > 0 && (
          <>
            <Divider />
            <GenerateButton>Generate Routes</GenerateButton>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
}
