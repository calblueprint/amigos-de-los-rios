"use client";

import { IconSvgs } from "@/lib/icons";
import {
  ButtonContainer,
  CardContainer,
  CloseIcon,
  CrownIcon,
  HeaderText,
  InfoContainer,
  ProfileContainer,
  TextHolder,
} from "./styles";

interface VolunteerCardProps {
  name: string;
  organization?: string | null;
  email: string;
  onUnassign?: () => void;
  onMakeLeader?: () => void; // Added this!
  isAdmin?: boolean;
  isGroupLeader?: boolean;
}

export default function VolunteerEmailCard({
  email,
  onUnassign,
  onMakeLeader,
  isAdmin,
  isGroupLeader,
}: VolunteerCardProps) {
  return (
    <CardContainer $isGroupLeader={isGroupLeader}>
      <InfoContainer>
        <ProfileContainer>{IconSvgs.mail}</ProfileContainer>
        <TextHolder>
          <HeaderText>{email}</HeaderText>
        </TextHolder>

        <ButtonContainer>
          {isAdmin && (
            <CrownIcon $isGroupLeader={isGroupLeader} onClick={onMakeLeader}>
              {IconSvgs.CrownIcon}
            </CrownIcon>
          )}
          {isAdmin && onUnassign && (
            <CloseIcon onClick={onUnassign}>{IconSvgs.CloseIcon}</CloseIcon>
          )}
        </ButtonContainer>
      </InfoContainer>
    </CardContainer>
  );
}
