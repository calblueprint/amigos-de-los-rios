"use client";

import { useState } from "react";
import { IconSvgs } from "@/lib/icons";
import { Team } from "@/types/schema";
import {
  TeamCard as Card,
  DeleteButton,
  DropdownIcon,
  InputWrapper,
  TeamField,
  TeamFieldsRow,
  TeamHeader,
  TeamInput,
  TeamLabel,
} from "./styles";

interface teamCardProps {
  team: Team;
  onDelete: () => void;
}

export default function TeamCard({ team, onDelete }: teamCardProps) {
  const [typeOpen, setTypeOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  return (
    <Card>
      <DeleteButton onClick={onDelete}>✕</DeleteButton>

      <TeamHeader>New Team</TeamHeader>

      <TeamFieldsRow>
        <TeamField>
          <TeamLabel>Volunteer Type</TeamLabel>
          <InputWrapper>
            <TeamInput
              as="select"
              defaultValue={team.type}
              onClick={() => setTypeOpen(prev => !prev)}
            >
              {["Type A", "Type B", "Type C", "Type D"].map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </TeamInput>

            <DropdownIcon $isOpen={typeOpen}>{IconSvgs.dropdown}</DropdownIcon>
          </InputWrapper>
        </TeamField>

        <TeamField>
          <TeamLabel>Team Size</TeamLabel>
          <InputWrapper>
            <TeamInput
              as="select"
              defaultValue={team.size}
              onClick={() => setSizeOpen(prev => !prev)}
            >
              {Array.from({ length: 11 }, (_, i) => i).map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </TeamInput>

            <DropdownIcon $isOpen={sizeOpen}>{IconSvgs.dropdown}</DropdownIcon>
          </InputWrapper>
        </TeamField>

        <TeamField>
          <TeamLabel>Time Per Field</TeamLabel>
          <InputWrapper>
            <TeamInput
              as="select"
              defaultValue={team.time}
              onClick={() => setTimeOpen(prev => !prev)}
            >
              {Array.from({ length: 6 }, (_, i) => i + 1).map(hour => (
                <option key={hour} value={`${hour} hour${hour > 1 ? "s" : ""}`}>
                  {hour} hour{hour > 1 ? "s" : ""}
                </option>
              ))}
            </TeamInput>

            <DropdownIcon $isOpen={timeOpen}>{IconSvgs.dropdown}</DropdownIcon>
          </InputWrapper>
        </TeamField>
      </TeamFieldsRow>
    </Card>
  );
}
