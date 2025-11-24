"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

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
    padding: clamp(0.25rem, 4vw, 0.75rem) 0;
  }
`;

export const Logo = styled.img`
  width: clamp(8rem, 4vw + 10rem, 14.375rem);
  height: auto;
`;
