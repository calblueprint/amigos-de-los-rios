"use client";

import { IconSvgs } from "@/lib/icons";
import {
  AdminDate,
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
  dateAdded: string;
  onDelete?: () => void;
}

export default function AdminCard({
  name,
  email,
  dateAdded,
  onDelete,
}: AdminCardProps) {
  return (
    <CardContainer>
      <LeftSection>
        <Avatar>{IconSvgs.admin_group}</Avatar>
        <AdminInfo>
          <AdminName>{name}</AdminName>
          <AdminEmail>{email}</AdminEmail>
          <AdminDate>Added {dateAdded}</AdminDate>
        </AdminInfo>
      </LeftSection>
      <DeleteButton onClick={onDelete} aria-label="Remove admin">
        {IconSvgs.delete}
      </DeleteButton>
    </CardContainer>
  );
}
