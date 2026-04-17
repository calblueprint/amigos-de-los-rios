"use client";

import { Team } from "@/types/schema";
import Dropdown from "../Dropdown/Dropdown";
import {
  TeamCard as Card,
  DeleteButton,
  TeamField,
  TeamFieldsRow,
  TeamHeader,
  TeamLabel,
} from "./styles";

interface teamCardProps {
  team: Team;
  onDelete: () => void;
  onUpdate: (updatedTeam: Team) => void;
}

export default function TeamCard({ team, onDelete, onUpdate }: teamCardProps) {
  return (
    <Card>
      <DeleteButton onClick={onDelete}>✕</DeleteButton>

      <TeamHeader>New Team</TeamHeader>

      <TeamFieldsRow>
        <TeamField>
          <TeamLabel>Volunteer Type</TeamLabel>
          <Dropdown
            value={team.type}
            options={["Type A", "Type B", "Type C", "Type D", "Type E"]}
            onChange={(value: string | number) =>
              onUpdate({ ...team, type: value as string })
            }
          />
        </TeamField>

        <TeamField>
          <TeamLabel>Team Size</TeamLabel>
          <Dropdown
            value={team.size}
            options={Array.from({ length: 11 }, (_, i) => i)}
            onChange={(value: string | number) =>
              onUpdate({ ...team, size: value as number })
            }
          />
        </TeamField>

        <TeamField>
          <TeamLabel>Time Per Field</TeamLabel>

          <Dropdown
            value={team.time}
            options={Array.from({ length: 6 }, (_, i) => {
              const hour = i + 1;
              return `${hour} hour${hour > 1 ? "s" : ""}`;
            })}
            onChange={(value: string | number) =>
              onUpdate({ ...team, time: value as string })
            }
          />
        </TeamField>
      </TeamFieldsRow>
    </Card>
  );
}
