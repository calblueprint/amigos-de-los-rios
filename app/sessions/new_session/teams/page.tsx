"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { useSessionCreation } from "@/app/utils/SessionCreationContext";
import Banner from "@/components/Banner/Banner";
import TeamCard from "@/components/TeamCard/TeamCard";
import { IconSvgs } from "@/lib/icons";
import {
  AddButton,
  BackLink,
  ContentContainer,
  ContentContainerWithPadding,
  EditTeamsHeader,
  FixedBottomContainer,
  GenerateButton,
  Label,
  NoTeams,
  PageContainer,
  TeamsContainer,
  Title,
} from "../styles";

export default function TeamsPage() {
  const { data, addTeam, deleteTeam } = useSessionCreation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

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

  // Redirect if basic info is missing
  useEffect(() => {
    if (!loading && (!data.sessionName || !data.centralHub || !data.date)) {
      router.push("/sessions/new_session/basic_info");
    }
  }, [loading, data.sessionName, data.centralHub, data.date, router]);

  const handleGenerate = () => {
    // TODO: Implement route generation with sessionName, centralHub, date, and teams
    console.log("Generating routes with:", {
      sessionName: data.sessionName,
      centralHub: data.centralHub,
      date: data.date,
      teams: data.teams,
    });
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
      <BackLink href="/sessions/new_session/basic_info">
        ← Back to Session Details
      </BackLink>

      <ContentContainerWithPadding>
        <Title>Route Assignment</Title>

        <EditTeamsHeader>
          <Label>Edit Route Assignments</Label>

          <AddButton>
            {React.cloneElement(IconSvgs.add, {
              onClick: addTeam,
              style: { cursor: "pointer" },
            })}
          </AddButton>
        </EditTeamsHeader>

        <TeamsContainer>
          {data.teams.length === 0 ? (
            <NoTeams>No routes made.</NoTeams>
          ) : (
            data.teams.map((team, index) => (
              <TeamCard
                key={index}
                team={team}
                onDelete={() => deleteTeam(index)}
              />
            ))
          )}
        </TeamsContainer>
      </ContentContainerWithPadding>

      {data.teams.length > 0 && (
        <FixedBottomContainer>
          <ContentContainer>
            <GenerateButton onClick={handleGenerate}>
              Generate Routes
            </GenerateButton>
          </ContentContainer>
        </FixedBottomContainer>
      )}
    </PageContainer>
  );
}
