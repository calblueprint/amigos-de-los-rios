"use client";

import { IconSvgs } from "@/lib/icons";
import {
  CardContainer,
  EmailText,
  HeaderText,
  InfoContainer,
  ProfileContainer,
  TextHolder,
} from "./styles";

interface VolunteerCardProps {
  name: string;
  organization?: string | null;
  email: string;
  isAdmin?: boolean;
}

export default function VolunteerEmailCardSearch({
  email,
}: VolunteerCardProps) {
  return (
    <CardContainer>
      <InfoContainer>
        <ProfileContainer>{IconSvgs.mail}</ProfileContainer>
        <TextHolder>
          <HeaderText>Add {email}</HeaderText>
          <EmailText>Send invitation by email</EmailText>
        </TextHolder>
      </InfoContainer>
    </CardContainer>
  );
}
