"use client";

import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "@/styles/containers";
import COLORS from "../../styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
  top: 0;
`;
export const ContentContainer = styled.div`
  margin: 0 15%;
  padding-top: 2.62rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding-top: 1.5rem;
  }
`;

export const TitleSection = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: #000;
  font-family: ${Sans.style.fontFamily};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.125rem;
  letter-spacing: -0.0375rem;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid ${COLORS.adlr_green};
  display: inline-block;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    line-height: 1.3rem;
  }
`;

export const PageTitle = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.75rem, 6vw, 2.5rem);
  }
`;

export const TitleUnderline = styled.div`
  height: 4px;
  width: 200px;
  background: ${COLORS.adlr_green};
  margin-bottom: 2rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 150px;
    margin-bottom: 1.5rem;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    gap: 1.25rem;
  }
`;

export const PasswordPanel = styled.div`
  width: 100%;
  border-radius: 0.75rem;
  background: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_gray};
  padding: 1.75rem 2rem;
  box-sizing: border-box;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1.25rem 1.5rem;
    border-radius: 0.625rem;
  }
`;

export const PasswordPanelTitle = styled.h2`
  margin: 0 0 1.25rem;
  color: ${COLORS.black};
  font-family: ${Sans.style.fontFamily};
  font-size: clamp(1.25rem, 2.5vw, 1.375rem);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.02rem;
`;

export const PasswordPanelRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PasswordPanelHelper = styled.p`
  margin: 0;
  flex: 1;
  min-width: 0;
  color: ${COLORS.adlr_property_gray};
  font-family: ${Sans.style.fontFamily};
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 400;
  line-height: 1.45;
`;

export const PasswordResetButton = styled.button`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  background: ${COLORS.adlr_blue};
  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  svg {
    flex-shrink: 0;
    color: inherit;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.85;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: 0.75rem 1.25rem;
  }
`;
