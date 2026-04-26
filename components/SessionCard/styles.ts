"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const SessionCard = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  padding: 24px;
  position: relative;
  align-items: flex-start;
  gap: 32px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background: #fff;

  overflow: hidden;
  cursor: ${({ $isEditing }) => ($isEditing ? "default" : "pointer")};
  min-height: 6rem;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 2px 2px 5px rgba(84, 84, 84, 0.15);
  }
`;

export const SessionDateCard = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const SessionDateDay = styled.p`
  color: #000;
  text-align: center;
  font-family: "DM Sans";
  font-size: 44px;
  font-style: normal;
  font-weight: 400;
  line-height: 44px; /* 100% */
  letter-spacing: -0.66px;
`;

export const SessionDateMonth = styled.p`
  color: #000;
  text-align: center;
  font-family: "DM Sans";
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 100% */
  letter-spacing: -0.42px;
`;

export const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const SessionHeader = styled.div`
  display: flex;
  padding: 12px 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;

export const SessionName = styled.p`
  color: #000;
  font-family: "DM Sans";
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px; /* 125% */
  letter-spacing: -0.36px;
`;

export const SessionHub = styled.p`
  color: #707070;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: -0.24px;
`;

export const SessionTitle = styled.h1`
  color: #707070;
  font-family: "DM Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 144.444% */
  letter-spacing: -0.27px;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: ${COLORS.white};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #fef3f3;
    border-color: #ffa2a3;
  }

  img {
    width: 1rem;
    height: 1rem;
  }
`;

export const NameInput = styled.input`
  color: #707070;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: -0.24px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  border: 0;
  width: 100%;
`;

export const DateInput = styled.input`
  font-family: "DM Sans";
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #707070;
  }
`;

export const BorderLine = styled.div`
  width: 1px;
  height: 120px;
  flex-shrink: 0;
  border: 1px solid #bfbfbf;
`;
