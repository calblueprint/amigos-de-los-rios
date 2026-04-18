"use client";

import { IconSvgs } from "@/lib/icons";
import {
  AdminAffiliation,
  AdminEmail,
  AdminInfo,
  AdminName,
  Avatar,
  CardContainer,
  DeleteButton,
  LeftSection,
} from "./styles";

interface AdminCardProps {
  name: string;
  email: string;
  affiliation: string;
  onDelete?: () => void;
}

export default function AdminCard({
  name,
  email,
  affiliation,
  onDelete,
}: AdminCardProps) {
  return (
    <CardContainer>
      <LeftSection>
        <Avatar>{IconSvgs.admin_group}</Avatar>
        <AdminInfo>
          <AdminName>{name}</AdminName>
          <AdminEmail>{email}</AdminEmail>
          <AdminAffiliation>{affiliation}</AdminAffiliation>
        </AdminInfo>
      </LeftSection>
      <DeleteButton onClick={onDelete} aria-label="Remove admin">
        {IconSvgs.delete}
      </DeleteButton>
    </CardContainer>
  );
}
