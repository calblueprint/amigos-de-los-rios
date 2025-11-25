"use client";

import { Team } from "@/types/schema";
import {
  TeamCard as Card,
  TeamField,
  TeamFieldsRow,
  TeamHeader,
  TeamInput,
  TeamLabel,
} from "./styles";

interface teamCardProps {
  team: Team;
}

export default function TeamCard({ team }: teamCardProps) {
  return (
    <Card>
      <TeamHeader>New Team</TeamHeader>

      <TeamFieldsRow>
        <TeamField>
          <TeamLabel>Volunteer Type</TeamLabel>
          <TeamInput value={team.type} />
        </TeamField>

        <TeamField>
          <TeamLabel>Team Size</TeamLabel>
          <TeamInput value={team.size} />
        </TeamField>

        <TeamField>
          <TeamLabel>Time Per Field</TeamLabel>
          <TeamInput value={team.time} />
        </TeamField>
      </TeamFieldsRow>
    </Card>
  );
}
