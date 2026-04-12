"use client";

import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const BackLink = styled(Link)`
  color: ${COLORS.adlr_blue};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 1.6875rem;
  margin: 2.63rem 15% 3rem 15%;
  // margin: 2.63rem 17.19rem 3rem 17.19rem;
  line-height: 0.72625rem;
  text-decoration: none;
  letter-spacing: -0.017rem;
  cursor: pointer;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.625rem, 4vw, 1rem);
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const ContentContainer = styled.div`
  margin: 0 15%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const CentralHubName = styled.h1`
  color: ${COLORS.adlr_black};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem;
  letter-spacing: -0.0375rem;
  margin-bottom: 2rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-bottom: 1rem;
  }
`;

export const DateHeader = styled.h1`
  color: ${COLORS.adlr_property_gray};
  display: flex;
  flex-direction: row;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: -0.01875rem;
  margin-bottom: 2.63rem;
  gap: 2rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1rem, 4vw, 1.25rem);
    margin-bottom: clamp(1rem, 4vw, 2.63rem);
  }
`;

export const RoutesHeaderContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
`;

export const RoutesButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.75rem;
  position: relative;
`;

export const RoutesHeader = styled.h1`
  color: ${COLORS.black};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem;
  letter-spacing: -0.02625rem;
  margin-bottom: 1.435rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.1rem, 4vw, 1.75rem);
    margin-bottom: 0rem;
  }
`;

export const RoutesList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 1rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const TrashIconButton = styled.button`
  border-radius: 50%;
  background: white;
  aspect-ratio: 1 / 1;
  border: 1px solid ${COLORS.adlr_light_gray};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;

  &:hover {
    background: #f3f4f6;
  }
`;

export const LegendIconButton = styled.button`
  border-radius: 50%;
  background: ${COLORS.adlr_light_gray};
  aspect-ratio: 1 / 1;
  border: 1px solid ${COLORS.adlr_light_gray};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
`;

export const PrintAllButton = styled.button`
  display: flex;
  padding: 0 1rem;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  color: #4a5565;
  border-radius: 0.625rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: ${COLORS.adlr_white};

  &:hover {
    background: #f3f4f6;
  }
`;

export const LegendDropdownWrapper = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 0.75rem;
  z-index: 100;
`;
