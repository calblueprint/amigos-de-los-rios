"use client";

import { IconSvgs } from "@/lib/icons";
import {
  ContinueButton,
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

export default function SuccessCard({ isOpen, onClose }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          Successfully Published
          {IconSvgs.success}
        </ModalHeader>

        <HeaderDivider />

        <ModalText>
          You have successfully published the created team. Volunteers will be
          emailed their assignment.
        </ModalText>

        <ContinueButton onClick={onClose}>Continue</ContinueButton>
      </ModalContainer>
    </ModalOverlay>
  );
}
