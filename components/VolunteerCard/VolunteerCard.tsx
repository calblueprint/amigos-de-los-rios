"use client";

import { IconSvgs } from "@/lib/icons";
import {
  ButtonContainer,
  CardContainer,
  CloseIcon,
  CrownIcon,
  EmailText,
  HeaderText,
  InfoContainer,
  OrgText,
  ProfileContainer,
  TextHolder,
} from "./styles";

interface VolunteerCardProps {
  name: string;
  organization?: string | null;
  email: string;
  onUnassign?: () => void; //fix later
  isAdmin?: boolean;
}

function getInitials(name: string) {
  if (!name) return "?";
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}

export default function VolunteerCard({
  name,
  organization,
  email,
  onUnassign,
  isAdmin,
}: VolunteerCardProps) {
  return (
    <CardContainer>
      <InfoContainer>
        <ProfileContainer>{getInitials(name)}</ProfileContainer>
        <TextHolder>
          <HeaderText>{name}</HeaderText>

          <OrgText>{organization || "Volunteer"}</OrgText>

          <EmailText>{email}</EmailText>
        </TextHolder>

        <ButtonContainer>
          <CrownIcon>{IconSvgs.CrownIcon}</CrownIcon>
          {isAdmin && onUnassign && (
            <CloseIcon onClick={onUnassign}>{IconSvgs.CloseIcon}</CloseIcon>
          )}
        </ButtonContainer>
      </InfoContainer>
    </CardContainer>
  );
}
