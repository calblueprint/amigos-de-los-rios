"use client";

import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${COLORS.white};
`;

export const ContentContainer = styled.div`
  margin: 0 15%;
  padding-top: 2.62rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    margin: 0 1rem;
    padding-top: 1.5rem;
    padding-bottom: 2rem;
  }
`;

export const TitleSection = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  color: ${COLORS.black};
  font-family: ${Sans.style.fontFamily};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.125rem;
  letter-spacing: -0.0375rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid ${COLORS.adlr_green};
  display: inline-block;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    line-height: 1.2;
  }
`;

export const PageTitle = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.2;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.75rem, 6vw, 2.5rem);
  }
`;

export const Description = styled.p`
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.82813rem; /* 162.5% */
  letter-spacing: -0.01688rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 0.9375rem;
    line-height: 1.5rem;
  }
`;

export const SectionCard = styled.div`
  background-color: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 1.25rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1.25rem;
    border-radius: 0.75rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.625rem; /* 150% */
  letter-spacing: -0.02625rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`;

export const AddAdminButton = styled.button`
  display: flex;
  padding: 0.5rem 1.43019rem 0.5625rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background-color: ${COLORS.adlr_blue};
  color: ${COLORS.white};
  border: none;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6875rem;
  letter-spacing: -0.01688rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 0.9375rem;
    padding: 0.4rem 0.75rem;
  }
`;

export const AdminCountBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: ${COLORS.adlr_light_green};
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6875rem;
  letter-spacing: -0.015rem;
  width: fit-content;
  height: 2.6875rem;
  padding: 0 1rem;
  border-radius: 0.3125rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 0.9375rem;
    height: 2.25rem;
    padding: 0 0.75rem;
  }
`;

export const CardsContainer = styled.div`
  margin-top: 1.5rem;
`;

export const ErrorMessage = styled.p`
  color: ${COLORS.red};
  font-family: "DM Sans";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.015rem;
  margin-top: 0.5rem;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FormLabel = styled.label`
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem; /* 150% */
  letter-spacing: -0.01875rem;

  span {
    color: ${COLORS.red};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

export const FormInput = styled.input`
  display: flex;
  height: 2.8125rem;
  padding: 0 1rem;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  width: 100%;
  border: 1px solid ${COLORS.adlr_light_gray};
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  outline: none;
  box-sizing: border-box;
  border-radius: 0.3125rem;
  background: ${COLORS.adlr_white};

  &::placeholder {
    color: ${COLORS.adlr_gray};
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column-reverse;
  }
`;

export const GrantButton = styled.button<{ $isComplete?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1.92675rem 0.5625rem 2rem;
  background-color: ${({ $isComplete }) =>
    $isComplete ? COLORS.adlr_green : COLORS.adlr_green};
  color: ${COLORS.white};
  border-radius: 0.3125rem;
  opacity: ${({ $isComplete }) => ($isComplete ? 1 : 0.5)};
  border: none;
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.6875rem;
  letter-spacing: -0.01688rem;
  cursor: ${({ $isComplete }) => ($isComplete ? "pointer" : "not-allowed")};
  transition:
    background-color 0.2s,
    opacity 0.2s;

  &:hover {
    background-color: ${({ $isComplete }) =>
      $isComplete ? COLORS.adlr_hover_green : COLORS.adlr_gray_green};
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: 0.625rem 1rem;
  }
`;

export const CancelButton = styled.button`
  display: flex;
  padding: 0.5rem 1.99563rem 0.5625rem 2.0625rem;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: ${COLORS.adlr_black};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.3125rem;
  cursor: pointer;
  text-align: center;
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6875rem; /* 150% */
  letter-spacing: -0.01688rem;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: 0.625rem 1rem;
  }
`;
