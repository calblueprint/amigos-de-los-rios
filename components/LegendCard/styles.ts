"use client";

import styled from "styled-components";

export const StyledLegend = styled.div`
  display: flex;
  width: 28.125rem;
  padding: 1.25rem 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem; /* Creates even spacing between each legend item */
  border-radius: 0.75rem;
  border: 1px solid #e5e5e5;
  background: white;
  box-shadow: 0 0.625rem 1.5625rem rgba(0, 0, 0, 0.1);
`;

export const LegendTypeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* Aligns text to the top of the icon */
  gap: 1rem;
  width: 100%;
`;

export const LegendTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* Space between the Header and the Description */
`;

export const LegendHeader = styled.div`
  color: black;
  font-family: "DM Sans", sans-serif;
  font-size: 1rem;
  font-weight: 700;
`;

export const LegendDescription = styled.div`
  color: #707070;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
`;

export const ImageIcon = styled.img`
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 0.75rem;
  object-fit: cover;
`;
