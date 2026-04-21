"use client";

import styled from "styled-components";

export const CardContainer = styled.div<{ $isGroupLeader?: boolean }>`
  display: flex;
  padding: 0.8125rem; /* 13px */
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 0.625rem; /* 10px */
  border: 0.0625rem solid #e5e7eb; /* 1px */
  background: #fff;

  border: 0.0625rem solid
    ${props => (props.$isGroupLeader ? "#D4AF37" : "#e5e7eb")}; /* 1px */
  background: ${props => (props.$isGroupLeader ? "#FFF9E6" : "#fff")};

  transition: all 0.2s ease-in-out;
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 12px */
  flex-shrink: 0;
  align-self: stretch;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */
  margin-left: auto;
`;

export const CrownIcon = styled.button<{ $isGroupLeader?: boolean }>`
  display: flex;
  width: 2rem; /* 32px */
  height: 2rem; /* 32px */
  padding: 0.375rem; /* 6px */
  justify-content: center;
  border-radius: 50%;
  align-items: center;

  background: transparent;
  border: none;
  cursor: pointer;
  background: ${props => (props.$isGroupLeader ? "#E9A23B" : "transparent")};
  transition: all 0.2s ease-in-out;

  svg {
    filter: ${props =>
      props.$isGroupLeader ? "brightness(0) invert(1)" : "none"};
  }

  &:hover {
    opacity: ${props => (props.$isGroupLeader ? 1 : 0.7)};
    background: ${props => (props.$isGroupLeader ? "#E9A23B" : "#FFFBED")};
  }
`;

export const CloseIcon = styled.button`
  display: flex;
  padding: 0.375rem; /* 6px */
  justify-content: center;
  align-items: center;

  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const TextHolder = styled.div`
  display: flex;
  width: 11.5835rem; /* 185.336px */
  flex-direction: column;
  align-items: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmailText = styled.p`
  display: flex;
  padding-right: 4.021rem; /* 64.336px */
  align-items: center;
  align-self: stretch;
  color: #99a1af;
  font-family: "DM Sans";
  font-size: 0.75rem; /* 12px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 18px */
`;

export const OrgText = styled.p`
  display: flex;
  padding-right: 4.2085rem; /* 67.336px */
  align-items: center;
  align-self: stretch;
  color: #6a7282;
  font-family: "DM Sans";
  font-size: 0.8125rem; /* 13px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.21875rem; /* 19.5px */
`;

export const HeaderText = styled.p`
  display: flex;
  padding-right: 4.771rem; /* 76.336px */
  align-items: center;
  align-self: stretch;
  color: #000;
  font-family: "DM Sans";
  font-size: 1rem; /* 16px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 24px */
`;

export const ProfileContainer = styled.div`
  display: flex;
  width: 2.5rem; /* 40px */
  height: 2.5rem; /* 40px */
  justify-content: center;
  align-items: center;
  border-radius: 1048575rem; /* 16777200px */
  background: #6a7282;
  color: #fff;
  font-family: "DM Sans";
  font-size: 1rem; /* 16px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 24px */
  letter-spacing: -0.0195rem; /* -0.312px */
`;
