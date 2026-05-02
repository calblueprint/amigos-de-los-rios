"use client";

import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
  box-sizing: border-box;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  width: 100%;
  max-width: 33.25rem; /* Caps the size on desktop */
  padding: 3rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.15);
  box-sizing: border-box;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1.5rem;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  padding: 0 0 0 0.1875rem;
  align-items: flex-start;
  font-size: 2rem;
  font-weight: 700;
  color: black;
  gap: 0.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.5rem; /* Scales text down slightly */
  }
`;

export const HeaderDivider = styled.div`
  width: 100%;
  height: 2px;
  background: #80bc51;
`;

export const ModalText = styled.p`
  color: #000;
  font-family: "DM Sans", sans-serif;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.25rem;
  letter-spacing: -0.0225rem;
  margin: 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.125rem;
    line-height: 1.5;
  }
`;

export const ContinueButton = styled.button`
  display: flex;
  width: 100%; /* Forces the button to take up the full width... */
  padding: 10px 16px; /* ...which lets us remove the massive 183px side padding */
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 5px;
  background: var(--ADLR-Green, #80bc51);
  color: white;
  text-align: center;
  font-family: "DM Sans";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: -0.36px;
  border: none;
  cursor: pointer;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.25rem;
  }

  &:hover {
    opacity: 0.5;
  }
`;
