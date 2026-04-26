"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoutes } from "@/actions/generateRoutes";
import supabase from "@/actions/supabase/client";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { useSessionCreation } from "@/app/utils/SessionCreationContext";
import Banner from "@/components/Banner/Banner";
import LegendCard from "@/components/LegendCard/LegendCard";
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
  Legend,
  LegendAddContainer,
  LegendAnchor,
  LegendDropdownWrapper,
  LegendIconButton,
  NoTeams,
  PageContainer,
  TeamsContainer,
  Title,
} from "../styles";

export default function TeamsPage() {
  const router = useRouter();

  const { data, addTeam, deleteTeam, updateTeams } = useSessionCreation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState(false);

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

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);

      // Call the route generation API
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "Missing auth session. Please sign in again and retry.",
        );
      }

      const response = await generateRoutes({
        sessionName: data.sessionName,
        centralHub: data.centralHub,
        date: data.date,
        teams: data.teams,
        accessToken,
      });

      // Navigate to the new session page
      router.push(`/sessions/${response.session.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate routes",
      );
      console.error("Error generating routes:", err);
    } finally {
      setGenerating(false);
    }
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
        <Title>Create Teams</Title>

        <EditTeamsHeader>
          <Label>Edit Route Assignments</Label>

          <LegendAddContainer>
            <LegendAnchor>
              <LegendIconButton onClick={() => setShowLegend(!showLegend)}>
                {IconSvgs.legend}
              </LegendIconButton>
              {showLegend && (
                <>
                  <Legend onClick={() => setShowLegend(false)} />
                  <LegendDropdownWrapper>
                    <LegendCard />
                  </LegendDropdownWrapper>
                </>
              )}
            </LegendAnchor>

            <AddButton>
              {React.cloneElement(IconSvgs.add, {
                onClick: addTeam,
              })}
            </AddButton>
          </LegendAddContainer>
        </EditTeamsHeader>

        <TeamsContainer>
          {data.teams.length === 0 ? (
            <NoTeams>No routes made.</NoTeams>
          ) : (
            data.teams.map((team, index) => (
              <TeamCard
                key={index}
                team={team}
                index={index}
                onDelete={() => deleteTeam(index)}
                onUpdate={updatedTeam => {
                  const updatedTeams = [...data.teams];
                  updatedTeams[index] = updatedTeam;
                  updateTeams(updatedTeams);
                }}
              />
            ))
          )}
        </TeamsContainer>
      </ContentContainerWithPadding>

      {data.teams.length > 0 && (
        <FixedBottomContainer>
          <ContentContainer>
            <GenerateButton onClick={handleGenerate} disabled={generating}>
              {generating ? "Generating..." : "Generate Routes"}
            </GenerateButton>
            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
          </ContentContainer>
        </FixedBottomContainer>
      )}
    </PageContainer>
  );
}
