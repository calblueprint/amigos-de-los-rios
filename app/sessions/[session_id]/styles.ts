"use client";

import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const BackLink = styled(Link)`
  color: ${COLORS.adlr_blue};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  display: block;
  margin: 2.63rem 17.19rem 3rem 17.19rem;
  line-height: 0.72625rem;
  letter-spacing: -0.01875rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const ContentContainer = styled.div`
  margin: 0 17.19rem;
`;

export const CentralHubName = styled.h1`
  color: ${COLORS.adlr_black};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem; /* 45% */
  letter-spacing: -0.0375rem;
  margin-bottom: 1.5rem;
`;

export const DateHeader = styled.h1`
  color: ${COLORS.black};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 90% */
  letter-spacing: -0.01875rem;
  margin-bottom: 2.63rem;
`;

export const RoutesHeader = styled.h1`
  color: ${COLORS.black};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem; /* 64.286% */
  letter-spacing: -0.02625rem;
  margin-bottom: 1.435rem;
`;

export const RoutesList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 1rem;
`;
