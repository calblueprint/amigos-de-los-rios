"use client";

import { IconSvgs } from "@/lib/icons";
import { Team } from "@/types/schema";
import Dropdown from "../Dropdown/Dropdown";
import DropdownMulti from "../DropdownMulti/DropdownMulti";
import {
  TeamCard as Card,
  DeleteButton,
  Divider,
  RouteNameInput,
  TeamField,
  TeamFieldsRow,
  TeamLabel,
  TimeInput,
} from "./styles";

interface teamCardProps {
  team: Team;
  index: number;
  onDelete: () => void;
  onUpdate: (updatedTeam: Team) => void;
}

export default function TeamCard({
  team,
  index,
  onDelete,
  onUpdate,
}: teamCardProps) {
  return (
    <Card>
      <DeleteButton onClick={onDelete}>{IconSvgs.close}</DeleteButton>

      <RouteNameInput placeholder={`Route ${index + 1}`} />
      <Divider />

      <TeamFieldsRow>
        <TeamField>
          <TeamLabel>Volunteer Type</TeamLabel>
          <Dropdown
            value={team.type}
            options={["Type A", "Type B", "Type C", "Type D"]}
            onChange={(value: string | number) =>
              onUpdate({ ...team, type: value as string })
            }
          />
        </TeamField>

        <TeamField>
          <TeamLabel>Fire Hydrant Type</TeamLabel>
          <DropdownMulti
            value={
              team.type === "Type A"
                ? []
                : (team.hydrant_type ?? ["Las Flores WC"])
            }
            options={[
              "Las Flores WC",
              "Lincoln Avenue WC",
              "Pasadena WP",
              "Rubio Canon WC",
            ]}
            onChange={value =>
              onUpdate({ ...team, hydrant_type: value as string[] })
            }
            disabled={team.type === "Type A"}
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
          <TeamLabel>Time Per Field (hrs)</TeamLabel>

          <TimeInput
            type="number"
            defaultValue={10}
            onChange={e => onUpdate({ ...team, time: Number(e.target.value) })}
          />
        </TeamField>
      </TeamFieldsRow>
    </Card>
  );
}
