"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

const MOBILE_BREAKPOINT = "800px";

export const RouteCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 0.75rem;
  background: white;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  min-height: 10rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const RouteInfo = styled.div`
  width: 65%;
  padding: 1.5rem 1.75rem;
  gap: 1.49rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: 1.25rem 1.25rem;
    gap: 0.75rem;
  }
`;

export const RouteIconBox = styled.div`
  width: 35%;
  aspect-ratio: 1 / 1;
  background: #e0e0e0; // placeholder gray

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    height: 10rem;
  }
`;

export const RouteTitle = styled.h3`
  color: ${COLORS.adlr_black};
  font-size: 1.41669rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02125rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.25rem;
  }
`;

export const RouteGroup = styled.p`
  color: ${COLORS.black};
  font-size: 1.26488rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.019rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.1rem;
  }
`;
