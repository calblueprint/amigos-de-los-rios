"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const ProfileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0.75rem;
  background: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_gray};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
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
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.02rem;
  margin-bottom: -2rem;
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
  margin-bottom: -2rem;
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
  color: ${COLORS.black};
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
  color: ${COLORS.adlr_black};
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

export const ProfileFieldInput = styled.input`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.015rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.375rem;
  background: white;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${COLORS.adlr_blue};
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1rem);
  }
`;

export const ProfileCardButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    flex-direction: column;
  }
`;

export const ProfileCardSaveButton = styled(ProfileCardButton)`
  background: ${COLORS.adlr_green};
  margin-bottom: -2rem;
`;

export const ProfileCardCancelButton = styled.button`
  background: white;
  color: ${COLORS.adlr_dark_gray};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  padding: 0.5rem 1.5rem;
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: -2rem;
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

export const ErrorText = styled.span`
  color: ${COLORS.red};
  font-family: "DM Sans";
  font-size: 0.875rem;
  font-style: normal;
  line-height: 1.25rem;
  letter-spacing: -0.0125rem;
`;
