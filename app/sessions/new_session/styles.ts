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
  margin: 0 20%;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin: 1rem 0 0.5rem 0;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${COLORS.adlr_gray};
  border-radius: 0.375rem;
  font-size: 1rem;
`;

export const TeamsContainer = styled.div`
  margin: 1rem 0 2rem 0;
`;

export const TeamCard = styled.div`
  background: #f2f2f2;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

export const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const TeamField = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const TeamInput = styled.input`
  width: 30%;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${COLORS.adlr_gray};
  border-radius: 0.25rem;
`;

export const EditIcon = styled.span`
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const AddIcon = styled.span`
  cursor: pointer;
  font-weight: bold;
`;

export const GenerateButton = styled.button`
  width: 100%;
  background: ${COLORS.adlr_blue};
  color: white;
  padding: 0.75rem;
  font-size: 1.25rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background: ${COLORS.adlr_hover_green};
  }
`;
