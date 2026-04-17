"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

export const CardContainer = styled.div`
  display: flex;
  padding: 13px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  align-self: stretch;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

export const CrownIcon = styled.button`
  display: flex;
  padding: 6px;
  justify-content: center;
  align-items: center;

  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const CloseIcon = styled.button`
  display: flex;
  padding: 6px;
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
  width: 185.336px;
  flex-direction: column;
  align-items: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmailText = styled.p`
  display: flex;
  padding-right: 64.336px;
  align-items: center;
  align-self: stretch;
  color: #99a1af;
  font-family: "DM Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`;

export const OrgText = styled.p`
  display: flex;
  padding-right: 67.336px;
  align-items: center;
  align-self: stretch;
  color: #6a7282;
  font-family: "DM Sans";
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 19.5px;
`;

export const HeaderText = styled.p`
  display: flex;
  padding-right: 76.336px;
  align-items: center;
  align-self: stretch;
  color: #000;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;

export const ProfileContainer = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 16777200px;
  background: #1a548a;
  color: #fff;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.312px;
`;
