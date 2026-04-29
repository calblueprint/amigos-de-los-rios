"use client";

import { IconSvgs } from "@/lib/icons";
import {
  ConfirmDeleteButton,
  GoBackButton,
  HeaderDivider,
  ModalContainer,
  ModalHeader,
  ModalOverlay,
  ModalText,
} from "./styles";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WarningCard({
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          Warning
          {IconSvgs.warningIcon}
        </ModalHeader>

        <HeaderDivider />

        <ModalText>
          Are you sure you want to delete a route?
          <br />
          This action cannot be undone.
        </ModalText>

        <ConfirmDeleteButton onClick={onConfirm}>Delete</ConfirmDeleteButton>

        <GoBackButton onClick={onClose}>Go Back</GoBackButton>
      </ModalContainer>
    </ModalOverlay>
  );
}
