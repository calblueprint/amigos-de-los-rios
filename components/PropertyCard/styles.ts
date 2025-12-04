"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 15%;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  background: ${COLORS.adlr_lighter_gray};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const OrderCircle = styled.div`
  width: 4.9375rem;
  height: 4.9375rem;
  border-radius: 50%;
  background: linear-gradient(0deg, #1a548a 0%, #80bc51 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.975rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.82688rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 15vw;
    height: 15vw;
    max-width: 4.9375rem;
    max-height: 4.9375rem;
    min-width: 3rem;
    min-height: 3rem;
    font-size: clamp(1.25rem, 4vw, 1.975rem);
  }
`;

export const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.43rem;
  flex: 1;
  margin-left: 15%;
  margin-right: 5%;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    gap: clamp(0.75rem, 4vw, 1.43rem);
  }
`;

export const PropertyName = styled.h3`
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02625rem;
  color: ${COLORS.adlr_black};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1rem, 4vw, 1.75rem);
  }
`;

export const PropertyAddress = styled.p`
  font-size: 1.375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02063rem;
  color: ${COLORS.adlr_property_gray};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.875rem, 4vw, 1.375rem);
  }
`;
