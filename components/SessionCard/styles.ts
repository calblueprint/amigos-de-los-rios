"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

export const SessionCard = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  padding: 1.5rem;
  position: relative;
  align-items: flex-start;
  gap: 2rem;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 0.625rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: white;

  overflow: hidden;
  cursor: ${({ $isEditing }) => ($isEditing ? "default" : "pointer")};
  min-height: 6rem;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0.125rem 0.125rem 0.3125rem rgba(84, 84, 84, 0.15);
  }
`;

export const SessionDateCard = styled.div`
  display: flex;
  padding: 1.25rem 1.25rem 1.25rem 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const SessionDateDay = styled.p`
  color: black;
  text-align: center;
  font-family: "DM Sans";
  font-size: 2.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.75rem; /* 100% */
  letter-spacing: -0.04125rem;
`;

export const SessionDateMonth = styled.p`
  color: black;
  text-align: center;
  font-family: "DM Sans";
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.75rem; /* 100% */
  letter-spacing: -0.02625rem;
`;

export const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const SessionHeader = styled.div`
  display: flex;
  padding: 0.75rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const SessionName = styled.p`
  color: black;
  font-family: "DM Sans";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.875rem; /* 125% */
  letter-spacing: -0.0225rem;
`;

export const SessionHub = styled.p`
  color: ${COLORS.adlr_property_gray};
  font-family: "DM Sans";
  font-size: 1rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.015rem;
`;

export const SessionTitle = styled.h1`
  color: ${COLORS.adlr_property_gray};
  font-family: "DM Sans";
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.625rem; /* 144.444% */
  letter-spacing: -0.016875rem;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: ${COLORS.white};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${COLORS.delete_background};
    border-color: $ ${COLORS.delete_border};
  }

  img {
    width: 1rem;
    height: 1rem;
  }
`;

export const NameInput = styled.input`
  color: ${COLORS.adlr_property_gray};
  font-family: "DM Sans";
  font-size: 1rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.015rem;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  border: 0;
  width: 100%;
`;

export const DateInput = styled.input`
  font-family: "DM Sans";
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${COLORS.adlr_property_gray};
  }
`;

export const BorderLine = styled.div`
  width: 1px;
  height: 7.5rem;
  flex-shrink: 0;
  border: 1px solid ${COLORS.sessions_line};
`;
