"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

export const BannerContainer = styled.div`
  background: ${COLORS.adlr_blue};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.img`
  height: auto;
  width: 14.375rem;
`;
