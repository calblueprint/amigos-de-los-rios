"use client";

import { DM_Sans } from "next/font/google";
import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const MOBILE_BREAKPOINT = "800px";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const PageContainer = styled.div`
  margin: 0 auto;
`;

export const BackLink = styled(Link)`
  color: ${COLORS.adlr_blue};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  display: block;
  margin: 2.63rem 15% 1.25rem 15%;
  // margin: 2.63rem 17.19rem 1.25rem 17.19rem;
  line-height: 0.72625rem;
  letter-spacing: -0.01875rem;
  cursor: pointer;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.4rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const ContentContainer = styled.div`
  margin: 0 15%;
`;

export const Header = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.0375rem;
  margin-bottom: 0.25rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.8rem;
    line-height: 2rem;
  }
`;

export const TabContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  padding: 0.75rem 0.81rem;
  background: ${props =>
    props.$active ? COLORS.adlr_light_gray : COLORS.adlr_lighter_gray};
  color: "black";
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.72625rem;
  letter-spacing: -0.01875rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.3125rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  margin-bottom: 1.25rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    line-height: 1.2;
  }

  &:hover {
    background: ${props =>
      props.$active ? COLORS.adlr_light_gray : COLORS.adlr_light_gray};
  }
`;

export const PropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;
