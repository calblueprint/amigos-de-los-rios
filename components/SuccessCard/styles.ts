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
  width: 460px;
  height: 2px;
  background: #80bc51;
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

export const ContinueButton = styled.button`
  display: flex;
  padding: 10px 183px;
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
  line-height: 36px; /* 150% */
  letter-spacing: -0.36px;
  border: none;

  &:hover {
    opacity: 0.5;
  }
`;
