"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const RouteCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.adlr_lighter_gray};
  background: ${COLORS.adlr_white};
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  min-height: 6rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const RouteInfo = styled.div`
  width: 65%;
  padding: 1.5625rem 1.5625rem 2rem 1.5625rem;
  flex: 1;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: 1.25rem 1.25rem;
    gap: 0.75rem;
  }
`;

export const RouteIconBox = styled.img`
  width: 22%;
  object-fit: cover;
  border-radius-left: 0.75rem;
`;

export const RouteTitle = styled.h3`
  color: ${COLORS.adlr_black};
  font-size: 1.375rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02125rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1rem, 4vw, 1.41669rem);
  }
`;

export const RouteGroup = styled.p`
  color: ${COLORS.adlr_property_gray};
  font-size: 1.125;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.019rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1.26488rem);
  }
`;

export const CloseIconButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: white;
  border: 1px solid ${COLORS.adlr_light_gray};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  color: #9ca3af;
  font-size: 1rem;

  &:hover {
    background: #f3f4f6;
  }
`;
