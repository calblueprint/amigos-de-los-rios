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
  height: 1268px;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  margin: 0 15%;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

export const DotOrange = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 16777200px;
  background: #ff6900;
`;

export const DotBlue = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 16777200px;
  background: #2b7fff;
`;

export const DotPurple = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 16777200px;
  background: #ad46ff;
`;

export const LargeDotPurple = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 16777200px;
  background: #ad46ff;
`;

export const LargeDotBlue = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 16777200px;
  background: #2b7fff;
`;

export const LargeDotOrange = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 16777200px;
  background: #ff6900;
`;

export const HeaderContainer = styled.div`
  display: flex;
  height: auto;
  padding: 25px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;

  border-radius: 10px;
  background: ${COLORS.adlr_white};
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid ${COLORS.adlr_light_gray};
`;

export const RouteValue = styled.div`
  display: flex;
  height: auto;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  flex-shrink: 0;
  align-self: stretch;
`;

export const RouteValueCard = styled.div`
  display: flex;
  height: auto;
  align-items: flex-start;
  gap: 12px;
`;

export const RouteValueCardText = styled.div`
  display: flex;
  width: auto;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const RouteValueVar = styled.h1`
  color: #707070;
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px; /* 150% */
  letter-spacing: -0.21px;
`;

export const RouteValueVarNum = styled.h1`
  color: #000;
  font-family: "DM Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px; /* 150% */
  letter-spacing: -0.27px;
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

export const TabContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  padding: 0.75rem 0.81rem;
  background: ${props =>
    props.$active ? COLORS.adlr_light_gray : COLORS.adlr_lighter_gray};
  color: "black";
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.72625rem;
  letter-spacing: -0.01875rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.3125rem;
  border: 1px solid ${COLORS.adlr_light_gray};
  margin-bottom: 1.25rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: clamp(0.75rem, 4vw, 1rem);
    padding: 0.5rem 0.75rem;
    line-height: 1.2;
  }

  &:hover {
    background: ${props =>
      props.$active ? COLORS.adlr_light_gray : COLORS.adlr_light_gray};
  }
`;

export const TeamContainer = styled.div`
  display: flex;
  width: auto;
  height: auto;
  padding: 25px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  border-radius: 10px;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: ${COLORS.adlr_white};
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
`;

export const TeamAssignment = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 36px; /* 150% */
  letter-spacing: -0.36px;
`;

export const TeamAssignmentCard = styled.div`
  display: flex;
  height: auto;
  padding: 13px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid ${COLORS.adlr_gray};
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
  color: #${COLORS.adlr_black};
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.312px;
`;

export const TeamAssignmentRole = styled.h1`
  color: ${COLORS.adlr_gray};
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.15px;
`;

export const RouteContainer = styled.div`
  display: flex;
  height: auto;
  padding: 25px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;

  border-radius: 10px;
  border: 1px solid #${COLORS.adlr_light_gray};
  background: ${COLORS.adlr_white};
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
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
  gap: 8px;
`;

export const RouteMap = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 25px; /* 125% */
  letter-spacing: -0.3px;
`;

export const RouteHolder = styled.div`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex-shrink: 0;
  align-self: stretch;
`;

export const RoutePoints = styled.h1`
  color: ${COLORS.black};
  font-family: "DM Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px; /* 150% */
  letter-spacing: -0.27px;
`;
export const PropertiesHolder = styled.div`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  align-self: stretch;
`;

export const PropertiesCard = styled.div`
  display: flex;
  height: 71px;
  padding: 0 12px;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid ${COLORS.adlr_light_gray};
  background: ${COLORS.adlr_white};
`;

export const PropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;
