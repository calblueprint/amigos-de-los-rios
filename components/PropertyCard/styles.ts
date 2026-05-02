"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const CardContainer = styled.div`
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: white;
`;

export const OrderCircle = styled.div<{
  $isHydrant: boolean;
  $isHub?: boolean;
}>`
  display: flex;
  border-radius: 50%;
  background-color: ${({ $isHub, $isHydrant }) => {
    if ($isHub) return "#AD46FF;";
    if ($isHydrant) return "#2B7FFF";
    return "#FF6900";
  }};
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
`;

export const PropertyInfo = styled.div`
  display: flex;
  width: 682.664px;
  height: 45px;
  flex-direction: column;
  align-items: flex-start;
`;

export const PropertyAddress = styled.h3`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  color: black;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: -0.24px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1rem, 4vw, 1.75rem);
  }
`;

export const PropertyType = styled.p`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  color: #6a7282;
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px; /* 150% */

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1.375rem);
  }
`;
