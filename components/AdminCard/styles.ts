"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const CardContainer = styled.div`
  display: flex;
  height: 7.0625rem;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 0.625rem;
  margin-bottom: 1rem;
  border: 1px solid ${COLORS.adlr_gray};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    height: auto;
    min-height: 4.5rem;
    padding: 0.75rem 1rem;
    align-items: center;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Avatar = styled.div`
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 1048575rem;
  background-color: ${COLORS.adlr_blue};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    stroke: ${COLORS.adlr_white};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export const AdminInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const AdminName = styled.p`
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem; /* 150% */
  letter-spacing: -0.01875rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

export const AdminEmail = styled.p`
  color: ${COLORS.adlr_dark_gray};
  font-family: "DM Sans";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.015rem;
`;

export const AdminAffiliation = styled.p`
  color: ${COLORS.adlr_dark_gray};
  font-family: "DM Sans";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3125rem;
  letter-spacing: -0.01313rem;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.adlr_dark_gray};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  height: 1.25rem;
  transition: opacity 0.2s;

  &:hover {
    color: ${COLORS.red};
    opacity: 0.7;
  }
`;
