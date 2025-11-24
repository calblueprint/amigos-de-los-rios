"use client";

import { useState } from "react";
import Banner from "@/components/Banner/Banner";
import {
  AddIcon,
  BackLink,
  ContentContainer,
  EditIcon,
  GenerateButton,
  Input,
  Label,
  PageContainer,
  TeamCard,
  TeamField,
  TeamHeader,
  TeamInput,
  TeamsContainer,
  Title,
} from "./styles";

export default function NewSession() {
  const [teams, setTeams] = useState([
    { type: "Type A", size: 5, time: "1 hour" },
  ]);

  const addTeam = () => {
    setTeams([...teams, { type: "Type A", size: 5, time: "1 hour" }]);
  };

  return (
    <PageContainer>
      <Banner />
      <BackLink href="/sessions">← Back to Sessions</BackLink>

      <ContentContainer>
        <Title>Create Session</Title>

        <Label>Session Name*</Label>
        <Input placeholder="Enter session name here" />

        <Label>Central Hub*</Label>
        <Input placeholder="Enter central hub name" />

        <Label>Date*</Label>
        <Input type="date" placeholder="MM/DD/YYYY" />

        <Label>Edit Teams</Label>
        <TeamsContainer>
          {teams.map((team, index) => (
            <TeamCard key={index}>
              <TeamHeader>
                <strong>New Team</strong>
                <div>
                  <EditIcon>✎</EditIcon>
                  <AddIcon onClick={addTeam}>+</AddIcon>
                </div>
              </TeamHeader>
              <TeamField>
                <span>Volunteer Type</span>
                <TeamInput value={team.type} />
              </TeamField>
              <TeamField>
                <span>Team Size</span>
                <TeamInput type="number" value={team.size} />
              </TeamField>
              <TeamField>
                <span>Time Per Field</span>
                <TeamInput value={team.time} />
              </TeamField>
            </TeamCard>
          ))}
        </TeamsContainer>

        <GenerateButton>Generate Routes</GenerateButton>
      </ContentContainer>
    </PageContainer>
  );
}
