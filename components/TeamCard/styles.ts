"use client";

import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const TeamCard = styled.div`
  background: ${COLORS.adlr_lighter_gray};
  border: 1px solid ${COLORS.adlr_light_gray};
  border-radius: 0.625rem;
  padding: 1.19rem 34.44rem 1rem 0.88rem;
`;

export const TeamHeader = styled.div`
  color: ${COLORS.adlr_black};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem;
  letter-spacing: -0.02625rem;
`;

export const TeamFieldsRow = styled.div`
  display: flex;
  gap: 2.75rem;
  justify-content: flex-start;
`;

export const TeamField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TeamLabel = styled.span`
  color: ${COLORS.adlr_black};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.02063rem;
  margin: 1.25rem 0;
`;

export const TeamInput = styled.input`
  padding: 0.87rem 3.83rem 0.81rem 0.96rem;
  background: ${COLORS.adlr_white};
  border: 1px solid ${COLORS.adlr_dark_gray};
  border-radius: 0.3125rem;
  width: 100%;
  box-sizing: border-box;

  color: ${COLORS.adlr_property_gray};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.01875rem;
`;
