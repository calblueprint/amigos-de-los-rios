"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const SessionCard = styled.div`
  display: flex;
  align-items: center;
  background: ${COLORS.adlr_lighter_gray};
  border-radius: 0.625rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  padding: 1.3rem;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 5%;
  }
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const SessionImage = styled.img`
  width: 8.578rem;
  height: auto;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 2.19rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: min(8.578rem, 37.5%);
    margin-right: 1.25rem;
  }
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
  line-height: 1.2;
  letter-spacing: -0.02625rem;
  margin-bottom: 1.375rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1rem, 4vw, 1.3125rem);
    margin-bottom: 0.5rem;
  }
`;

export const SessionHub = styled.p`
  color: ${COLORS.black};
  fontfamily: "DM Sans";
  font-size: 1.17rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02344rem;
  margin-bottom: 0.45rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1.17rem);
    margin-bottom: 0.375rem;
  }
`;

export const SessionTitle = styled.h2`
  color: var(--Light-text, #707070);
  fontfamily: "DM Sans";
  font-size: 1.03rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02063rem;
  margin-bottom: 0.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.75rem, 4vw, 1.03rem);
    margin-bottom: 0.25rem;
  }
`;
