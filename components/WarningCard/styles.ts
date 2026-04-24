"use client";

import styled from "styled-components";

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
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  width: 33.25rem;
  padding: 3rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.header`
  display: flex;
  padding: 0 0 0 0.1875rem;
  align-items: flex-start;
  font-size: 2rem;
  font-weight: 700;
  color: black;
  gap: 0.5rem;
`;

export const HeaderDivider = styled.div`
  width: 13.5625rem;
  height: 2px; /* Kept as px to prevent blurry rendering on thin lines */
  background: #dd707b;
`;

// Changed from styled.header to styled.p for better HTML semantics
export const ModalText = styled.p`
  color: #000;
  font-family: "DM Sans", sans-serif;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.25rem;
  letter-spacing: -0.0225rem;
  margin: 0;
`;

export const ConfirmDeleteButton = styled.button`
  display: flex;
  padding: 0.625rem 0;
  justify-content: center;
  align-items: center;
  align-self: stretch; /* Makes it span the full width */
  border-radius: 0.3125rem;
  background: #dd707b;
  color: white; /* Make text white */
  font-size: 1.25rem;
  border: none;
  cursor: pointer;

  &:hover {
    background: #c5626c;
  }
`;

export const GoBackButton = styled.button`
  display: flex; /* Fixed missing semicolon here */
  justify-content: center;
  align-items: center;
  align-self: stretch; /* Makes it align properly under the delete button */

  color: var(--Light-text, #707070);
  background: transparent;
  border: none;
  cursor: pointer;

  font-family: "DM Sans", sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: -0.01875rem;

  &:hover {
    color: #555;
  }
`;
