"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

const MOBILE_BREAKPOINT = "800px";

export const BannerContainer = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: ${COLORS.adlr_blue};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1rem 0;
  }
`;

export const Logo = styled.img`
  height: auto;
  width: 14.375rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 12rem;
  }
`;
