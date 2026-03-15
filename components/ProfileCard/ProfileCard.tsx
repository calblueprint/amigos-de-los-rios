"use client";

import {
  ProfileCardButton,
  ProfileCardContainer,
  ProfileCardContent,
  ProfileCardHeader,
  ProfileCardTitle,
  ProfileField,
  ProfileFieldLabel,
  ProfileFieldValue,
} from "./styles";

interface ProfileFieldType {
  label: string;
  value: string;
}

interface ProfileCardProps {
  title: string;
  fields: ProfileFieldType[];
  buttonText: string;
  onButtonClick: () => void;
}

export default function ProfileCard({
  title,
  fields,
  buttonText,
  onButtonClick,
}: ProfileCardProps) {
  return (
    <ProfileCardContainer>
      <ProfileCardHeader>
        <ProfileCardTitle>{title}</ProfileCardTitle>
        <ProfileCardButton onClick={onButtonClick}>
          {buttonText}
        </ProfileCardButton>
      </ProfileCardHeader>
      <ProfileCardContent>
        {fields.map((field, index) => (
          <ProfileField key={index}>
            <ProfileFieldLabel>{field.label}</ProfileFieldLabel>
            <ProfileFieldValue>{field.value}</ProfileFieldValue>
          </ProfileField>
        ))}
      </ProfileCardContent>
    </ProfileCardContainer>
  );
}
