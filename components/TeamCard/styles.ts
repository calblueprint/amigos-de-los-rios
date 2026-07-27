"use client";

import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const TeamCard = styled.div`
  background: ${COLORS.adlr_lighter_gray};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.75rem;
  padding: 1.25rem 1.25rem 1.5rem 1.25rem;
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1rem 10% 1rem 10%;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;

  width: 2rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 50%;
  cursor: pointer;

  transition: all 0.15s ease-in-out;

  &:hover {
    background: #fef3f3;
    border-color: #ffa2a3;
  }
`;

export const RouteNameInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: transparent;
  outline: none;

  color: ${COLORS.adlr_black};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.375rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 0.25rem 2.5rem 0.5rem 0;

  &::placeholder {
    color: ${COLORS.adlr_property_gray};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1rem;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${COLORS.adlr_black};
  margin: 0 3rem 2.25rem 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    margin: 0 0 1rem 0;
  }
`;

export const TeamFieldsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const TeamField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const TeamLabel = styled.span`
  color: ${COLORS.adlr_black};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.01rem;
  margin-bottom: 0.625rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
`;

interface DropdownIconProps {
  $isOpen?: boolean;
}

export const DropdownIcon = styled.div<DropdownIconProps>`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%)
    rotate(${props => (props.$isOpen ? "180deg" : "0deg")});
  transition: transform 0.2s ease-in-out;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const TimeInput = styled.input`
  padding: 0.87rem 1rem 0.81rem 0.96rem;
  background: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.3125rem;
  width: 100%;
  box-sizing: border-box;
  color: ${COLORS.adlr_property_gray};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  outline: none;
`;
