"use client";

import { DM_Sans } from "next/font/google";
import Link from "next/link";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "@/styles/containers";
import COLORS from "../../styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const PageContainer = styled.main`
  margin: 0 auto;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 2.62rem 15% 1.25rem 15%;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    margin: 1rem 15% 0.5rem 15%;
  }
`;

export const Header = styled.h1`
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.0375rem;
  margin-bottom: 0.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-bottom: 0rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const AddButton = styled(Link)`
  background: ${COLORS.adlr_green};
  color: white;
  padding: 0.5625rem 0.625rem 0.625rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-family: ${Sans.style.fontFamily};
  font-weight: 400;
  font-size: 1.25rem;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: ${COLORS.adlr_hover_green};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1rem);
  }
`;

export const EditButton = styled.button`
  background: ${COLORS.adlr_lighter_gray};
  padding: 0.5625rem 0.625rem 0.625rem 0.75rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.375rem;
  font-family: ${Sans.style.fontFamily};
  font-weight: 400;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${COLORS.adlr_gray};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1rem);
  }
`;

export const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0 15% 2rem 15%;
`;

export const SignOutButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${COLORS.adlr_lighter_gray};
  color: ${COLORS.adlr_black};
  padding: 0.5rem 1rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.375rem;
  font-family: ${Sans.style.fontFamily};
  font-weight: 400;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
  &:hover {
    background: ${COLORS.adlr_gray};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    top: 0.5rem;
    left: 0.5rem;
  }
`;
