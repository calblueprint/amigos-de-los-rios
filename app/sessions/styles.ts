"use client";

import styled from "styled-components";
import COLORS from "../../styles/colors";

export const PageContainer = styled.main`
  margin: 0 auto;
`;

export const Banner = styled.div`
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

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 2.62rem 17.19rem 1.25rem 17.19rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const AddButton = styled.button`
  background: ${COLORS.adlr_green};
  color: white;
  padding: 0.5625rem 0.625rem 0.625rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  fontfamily: "DM Sans";
  font-weight: 400;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${COLORS.adlr_hover_green};
  }
`;

export const EditButton = styled.button`
  background: ${COLORS.adlr_lighter_gray};
  padding: 0.5625rem 0.625rem 0.625rem 0.75rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.375rem;
  fontfamily: "DM Sans";
  font-weight: 400;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${COLORS.adlr_gray};
  }
`;

export const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0 17.19rem 2rem 17.19rem;
`;
