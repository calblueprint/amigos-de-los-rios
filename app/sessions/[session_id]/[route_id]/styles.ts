"use client";

import { DM_Sans } from "next/font/google";
import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { MOBILE_BREAKPOINT } from "@/styles/containers";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const PageContainer = styled.div`
  margin: 0 auto;
`;

export const BackLink = styled(Link)`
  color: ${COLORS.adlr_blue};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  display: block;
  margin: 2.63rem 15% 1.25rem 15%;
  line-height: 0.72625rem;
  letter-spacing: -0.01875rem;
  cursor: pointer;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.625rem, 4vw, 1rem);
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const AllContent = styled.div`
  display: inline-flex;
  height: 79.25rem; /* 1268px */
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem; /* 24px */
  margin: 0 15%;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem; /* 24px */
`;

export const DotOrange = styled.div`
  width: 0.75rem; /* 12px */
  height: 0.75rem; /* 12px */
  flex-shrink: 0;
  border-radius: 1048575rem; /* 16777200px */
  background: ${COLORS.orange};
`;

export const DotBlue = styled.div`
  width: 0.75rem; /* 12px */
  height: 0.75rem; /* 12px */
  flex-shrink: 0;
  border-radius: 1048575rem; /* 16777200px */
  background: ${COLORS.blue};
`;

export const DotPurple = styled.div`
  width: 0.75rem; /* 12px */
  height: 0.75rem; /* 12px */
  flex-shrink: 0;
  border-radius: 1048575rem; /* 16777200px */
  background: ${COLORS.purple};
`;

export const HeaderContainer = styled.div`
  display: flex;
  height: auto;
  padding: 1.5625rem; /* 25px */
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem; /* 24px */
  align-self: stretch;

  border-radius: 0.625rem; /* 10px */
  background: ${COLORS.adlr_white};
  box-shadow:
    0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1),
    /* 0 1px 3px 0 */ 0 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.1); /* 0 1px 2px -1px */
  border: 0.0625rem solid ${COLORS.adlr_light_gray}; /* 1px */
`;

export const RouteValue = styled.div`
  display: flex;
  height: auto;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem; /* 16px */
  flex-shrink: 0;
  align-self: stretch;
`;

export const RouteValueCard = styled.div`
  display: flex;
  height: auto;
  align-items: flex-start;
  gap: 0.75rem; /* 12px */
  padding-right: 61px;
`;

export const RouteValueCardText = styled.div`
  display: flex;
  width: auto;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem; /* 4px */
`;

export const RouteValueVar = styled.h1`
  color: ${COLORS.adlr_property_gray};
  font-family: "DM Sans";
  font-size: 0.875rem; /* 14px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.3125rem; /* 21px */ /* 150% */
  letter-spacing: -0.013125rem; /* -0.21px */
`;

export const RouteValueVarNum = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.125rem; /* 18px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.6875rem; /* 27px */ /* 150% */
  letter-spacing: -0.016875rem; /* -0.27px */
`;

export const Header = styled.h1`
  display: flex;
  align-items: center;
  align-self: stretch;
  font-family: ${Sans.style.fontFamily};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.0375rem;
  margin-bottom: 0.25rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    line-height: 2rem;
  }
`;

export const TeamContainer = styled.div`
  display: flex;
  width: auto;
  height: auto;
  padding: 1.5625rem; /* 25px */
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem; /* 24px */

  border-radius: 0.625rem; /* 10px */
  border: 0.0625rem solid ${COLORS.adlr_light_gray}; /* 1px */
  background: ${COLORS.adlr_white};
  box-shadow:
    0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1),
    /* 0 1px 3px 0 */ 0 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.1); /* 0 1px 2px -1px */
`;

export const TeamAssignment = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.5rem; /* 24px */
  font-style: normal;
  font-weight: 700;
  line-height: 2.25rem; /* 36px */ /* 150% */
  letter-spacing: -0.0225rem; /* -0.36px */
`;

export const TeamAssignmentCard = styled.div`
  display: flex;
  height: auto;
  padding: 0.8125rem; /* 13px */
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 0.625rem; /* 10px */
  border: 0.0625rem solid ${COLORS.adlr_gray}; /* 1px */
  background: ${COLORS.adlr_white};
`;

export const TeamAssignmentText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
`;

export const TeamAssignmentName = styled.h1`
  color: ${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 1rem; /* 16px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 24px */
  letter-spacing: -0.0195rem; /* -0.312px */
`;

export const TeamAssignmentRole = styled.h1`
  color: ${COLORS.adlr_gray};
  font-family: "DM Sans";
  font-size: 0.875rem; /* 14px */
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; /* 20px */
  letter-spacing: -0.009375rem; /* -0.15px */
`;

export const RouteContainer = styled.div`
  display: flex;
  height: auto;
  padding: 1.5625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;

  border-radius: 0.625rem;
  border: 0.0625rem solid ${COLORS.adlr_light_gray};
  background: ${COLORS.adlr_white};
  box-shadow:
    0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1),
    0 0.0625rem 0.125rem -0.0625rem rgba(0, 0, 0, 0.1);

  @media print {
    padding: 15mm !important;
    border: none !important;
    box-shadow: none !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;

    iframe {
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 0.5rem !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;

export const RouteHeader = styled.div`
  display: flex;
  height: auto;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
`;

export const RouteType = styled.div`
  display: flex;
  width: auto;
  height: auto;
  align-items: center;
  gap: 0.5rem; /* 8px */
`;

export const RouteMap = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.25rem; /* 20px */
  font-style: normal;
  font-weight: 700;
  line-height: 1.5625rem; /* 25px */ /* 125% */
  letter-spacing: -0.01875rem; /* -0.3px */
`;

export const RouteHolder = styled.div`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem; /* 12px */
  flex-shrink: 0;
  align-self: stretch;
`;

export const AssignedUsers = styled.p`
  color: black;
  font-family: "DM Sans";
  font-size: 1.125rem; /* 18px */
  font-style: normal;
  font-weight: 700;
  line-height: 1.6875rem; /* 27px */
  letter-spacing: -0.016875rem; /* -0.27px */
`;

export const RoutePoints = styled.div`
  display: flex;
  align-self: stretch;
  width: 100%;
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 1.125rem;
  justify-content: space-between;
  font-style: normal;
  font-weight: 700;
  line-height: 1.6875rem;
  letter-spacing: -0.016875rem;
`;

export const PropertiesHolder = styled.div`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem; /* 8px */
  flex-shrink: 0;
  align-self: stretch;
`;

export const PrintButton = styled.button`
  width: 1.65975rem;
  height: 1.65975rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 0.240125rem;
  border: 0.051875rem solid ${COLORS.adlr_light_gray};
  background: ${COLORS.adlr_white};
`;

export const PrintHeader = styled.h1`
  display: flex;
  flex-direction: row;
  color: ${COLORS.print_header};
  font-family: "DM Sans";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  gap: 0.5rem;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  display: flex;
  height: 2.625rem; /* 42px */
  padding: 0.5rem 1rem; /* 8px 16px */
  align-items: center;
  align-self: stretch;
  width: 100%;
  border-radius: 0.3125rem;
  border: 0.0625rem solid ${COLORS.adlr_light_gray};
  font-family: "DM Sans";
  font-size: 1rem; /* 16px */
  font-style: normal;
  font-weight: 400;
  color: ${COLORS.black};
  box-sizing: border-box;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.blue};
  }
`;

export const SearchResultsDropdown = styled.div`
  position: absolute;
  display: flex;
  background: white;
  width: 100%;
  border: 0.0625rem solid ${COLORS.adlr_light_gray}; /* 1px */
  border-top: none;
  border-radius: 0 0 0.3125rem 0.3125rem;
  max-height: 18.75rem; /* 300px */
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);

  flex-direction: column;
  gap: 0.5rem; /* 8px */
  padding: 0.5rem; /* 8px */
`;

export const SearchMessage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem; /* 16px */
  font-family: "DM Sans";
  font-size: 0.875rem; /* 14px */
  color: ${COLORS.adlr_light_gray};
  position: center;
`;

export const PublishButton = styled.button<{ $hasChanges?: boolean }>`
  display: flex;
  padding: 0.625rem 7.0625rem 0.6875rem 7.0835rem; /* 10px 113px 11px 113.336px */
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 0.625rem; /* 10px */
  background: #80bc51;
  color: white;
  text-align: center;
  font-family: "DM Sans";
  font-size: 1.125rem; /* 18px */
  font-style: normal;
  font-weight: 700;
  line-height: 1.6875rem; /* 27px */
  letter-spacing: -0.016875rem; /* -0.27px */
  border: none;
  opacity: ${props => (props.$hasChanges ? 1 : 0.5)};
  cursor: ${props => (props.$hasChanges ? "pointer" : "default")};
`;

export const NavigateMaps = styled.div`
  display: flex;
  width: 180.414px;
  height: 21px;
  align-items: center;
  gap: 8px;
  color: #1a548a;
  text-align: center;
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px; /* 150% */
  letter-spacing: -0.21px;
  cursor: pointer;
`;

export const HeaderSpacer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;
