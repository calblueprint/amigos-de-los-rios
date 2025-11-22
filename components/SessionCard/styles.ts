"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

export const SessionCard = styled.div`
  display: flex;
  align-items: center;
  background: ${COLORS.adlr_lighter_gray};
  border-radius: 0.625rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  padding: 1.3rem;
`;

export const SessionImage = styled.img`
  width: 8.578rem; /* 0.75 * figma width */
  height: 6.703rem; /* 0.75 * figma height */
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 2.19rem;
`;

export const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SessionDate = styled.p`
  color: ${COLORS.black};
  fontfamily: "DM Sans";
  font-size: 1.3125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem; /* 64.286% */
  letter-spacing: -0.02625rem;
  margin-bottom: 1.375rem;
`;

export const SessionHub = styled.p`
  color: ${COLORS.black};
  fontfamily: "DM Sans";
  font-size: 1.17rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 72% */
  letter-spacing: -0.02344rem;
  margin-bottom: 0.45rem;
`;

export const SessionTitle = styled.h2`
  color: var(--Light-text, #707070);
  fontfamily: "DM Sans";
  font-size: 1.03rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 81.818% */
  letter-spacing: -0.02063rem;
  margin-bottom: 0.5rem;
`;
