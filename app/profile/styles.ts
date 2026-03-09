"use client";

import { DM_Sans } from "next/font/google";
import Link from "next/link";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "@/styles/containers";
import COLORS from "../../styles/colors";
import { Container } from "../(auth)/styles";

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
