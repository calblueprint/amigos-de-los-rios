"use client";

import styled from "styled-components";

export const RouteCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px); /* Slight lift on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
  }
`;

export const RouteInfo = styled.div`
  text-align: center;
`;

export const RouteTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #333;
`;

export const RouteLabel = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 0.5rem;
`;

export const RouteDate = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
`;
