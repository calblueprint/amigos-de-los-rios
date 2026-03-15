"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const ProfileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0.75rem;
  background: #fffffb;
  border: 1px solid ${COLORS.adlr_gray};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    border-radius: 0.625rem;
  }
`;

export const ProfileCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem 1rem 1.75rem;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.25rem 1rem 1.25rem;
  }
`;

export const ProfileCardTitle = styled.h2`
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.02rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.125rem, 4vw, 1.5rem);
  }
`;

export const ProfileCardButton = styled.button`
  background: ${COLORS.adlr_blue};
  color: white;
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  padding: 0.5rem 1.4575rem 0.5625rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: 0.75rem 1.5rem;
  }
`;

export const ProfileCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.75rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1.25rem;
    gap: 1.25rem;
  }
`;

export const ProfileField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProfileFieldLabel = styled.label`
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem; /* 150% */
  letter-spacing: -0.01875rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1rem);
  }
`;

export const ProfileFieldValue = styled.p`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.015rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1rem);
  }
`;
