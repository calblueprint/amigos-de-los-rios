"use client";

import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const TeamCard = styled.div`
  background: ${COLORS.adlr_lighter_gray};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.625rem;
  padding: 1.19rem 34.44rem 1rem 0.88rem;
  position: relative;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;

  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffebeb;
  color: #d60000;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;

  transition: all 0.15s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  &:hover {
    background: #ffcccc;
    color: #b00000;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const TeamHeader = styled.div`
  color: ${COLORS.adlr_black};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem;
  letter-spacing: -0.02625rem;
`;

export const TeamFieldsRow = styled.div`
  display: flex;
  gap: 2.75rem;
  justify-content: flex-start;
`;

export const TeamField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TeamLabel = styled.span`
  color: ${COLORS.adlr_black};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.02063rem;
  margin: 1.25rem 0;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
`;

interface DropdownIconProps {
  $isOpen?: boolean;
}

export const TeamInput = styled.input`
  padding: 0.87rem 3rem 0.81rem 0.96rem;
  background: ${COLORS.adlr_white};
  appearance: none;
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.3125rem;
  width: 100%;
  box-sizing: border-box;

  color: ${COLORS.adlr_property_gray};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.01875rem;

  &::placeholder {
    color: ${COLORS.adlr_light_gray};
  }
`;

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
    width: 16px;
    height: 16px;
  }
`;
