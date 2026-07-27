"use client";

import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const FakeInput = styled.div<{ $disabled?: boolean }>`
  padding: 0.87rem 1rem 0.81rem 0.96rem;
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.3125rem;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${COLORS.adlr_property_gray};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;

  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  background: ${({ $disabled }) =>
    $disabled ? COLORS.adlr_light_gray : COLORS.adlr_white};
`;

export const FakeInputText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;

  background: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.5rem;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
`;

export const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-syle: normal;
  font-weight: 400;
  line-height: 1.125rem;

  &:hover {
    background: ${COLORS.adlr_light_gray};
  }
`;

export const DropdownIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  pointer-events: none;

  transform: ${({ $isOpen }) => ($isOpen ? "rotate(0deg)" : "rotate(180deg)")};
  transition: transform 0.2s ease;
`;

export const CheckboxBox = styled.div<{ $checked: boolean }>`
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.2rem;
  border: 1.5px solid
    ${({ $checked }) => ($checked ? "#3B82F6" : COLORS.adlr_dark_gray)};
  background: ${({ $checked }) => ($checked ? "#3B82F6" : COLORS.adlr_white)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
`;

export const DropdownMultiItem = styled(DropdownItem)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;
