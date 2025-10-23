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
  padding: 0.5rem 1.25rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.375rem;
  fontfamily: "DM Sans";
  font-weight: 500;
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
  margin-bottom: 0.725rem;
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
