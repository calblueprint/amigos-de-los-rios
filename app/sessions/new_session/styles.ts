"use client";

import { ButtonHTMLAttributes } from "react";
import { DM_Sans } from "next/font/google";
import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const BackLink = styled(Link)`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.adlr_blue};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  display: block;
  margin: 2.63rem 17.19rem 2.81rem 17.19rem;
  line-height: 0.72625rem;
  letter-spacing: -0.01875rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const ContentContainer = styled.div`
  margin: 0 17.19rem 1.5rem 17.19rem;
`;

export const Title = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem;
  letter-spacing: -0.0375rem;
  margin-bottom: 2.75rem;
`;

export const Label = styled.label`
  font-family: ${Sans.style.fontFamily};
  display: block;
  margin: 1.25rem 0 0.73rem 0;
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.02625rem;

  .required {
    color: ${COLORS.red};
    margin-left: 0.25rem;
  }
`;

export const Input = styled.input`
  font-family: ${Sans.style.fontFamily};
  width: 100%;
  padding: 0.825rem;
  border: 1px solid ${COLORS.adlr_gray};
  border-radius: 0.3125rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.01875rem;
`;

export const EditTeamsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`;

export const AddButton = styled.div`
  display: flex;
  margin-right: 1rem;
`;

export const TeamsContainer = styled.div`
  margin: 1rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const NoTeams = styled.div`
  color: ${COLORS.adlr_property_gray};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.01875rem;
`;

export const Divider = styled.div`
  width: 100vw;
  height: 1px;
  background: ${COLORS.adlr_light_gray};
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.45);
`;

export const GenerateButton = styled.button`
  padding: 1.19rem 11.44rem;

  background-color: ${(props: ButtonHTMLAttributes<HTMLButtonElement>) =>
    props.disabled ? COLORS.adlr_light_gray : COLORS.adlr_navy};

  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.02625rem;
  border-radius: 0.3125rem;

  cursor: ${(props: ButtonHTMLAttributes<HTMLButtonElement>) =>
    props.disabled ? "not-allowed" : "pointer"};
  margin: 0 auto;
  display: block;
  border: none;
  box-shadow: 0 0.125rem 0.188rem rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: ${(props: ButtonHTMLAttributes<HTMLButtonElement>) =>
      props.disabled ? COLORS.adlr_light_gray : COLORS.adlr_blue};
  }
  &:disabled {
    pointer-events: none;
  }
`;

export const FixedBottomContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${COLORS.white};
  padding: 1.5rem 0 0 0;
  border-top: 1px solid ${COLORS.adlr_light_gray};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

export const ContentContainerWithPadding = styled(ContentContainer)`
  padding-bottom: 8rem;
`;

export const NextButton = styled.button`
  padding: 1.19rem 11.44rem;
  background: ${COLORS.adlr_navy};
  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.02625rem;
  border-radius: 0.3125rem;
  cursor: pointer;
  margin: 2rem auto 0 auto;
  display: block;

  &:hover {
    background: ${COLORS.adlr_blue};
  }
`;
