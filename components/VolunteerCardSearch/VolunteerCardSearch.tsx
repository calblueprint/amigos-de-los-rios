"use client";

import {
  CardContainer,
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
  isAdmin?: boolean;
}

function getInitials(name: string) {
  if (!name) return "?";
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}

export default function VolunteerCardSearch({
  name,
  organization,
  email,
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
      </InfoContainer>
    </CardContainer>
  );
}
