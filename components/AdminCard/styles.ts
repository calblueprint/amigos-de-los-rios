"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

export const CardContainer = styled.div`
  display: flex;
  height: 7.0625rem;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 0.625rem;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${COLORS.adlr_blue};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    stroke: ${COLORS.adlr_white};
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

export const AdminDate = styled.p`
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
  color: ${COLORS.red};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;
