import { DM_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Container Components
export const Container = styled.div`
  min-height: 100vh;
  background-color: ${COLORS.adlr_blue};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  gap: 2.5rem;
`;

export const Logo = styled(Image)`
  object-fit: contain;
`;

export const Card = styled.div`
  background-color: ${COLORS.white};
  border-radius: 1rem;
  padding: 2.5rem;
  max-width: 27.5rem;
  width: 100%;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
`;

// Message Components
export const Message = styled.div<{ $isError?: boolean }>`
  font-family: ${Sans.style.fontFamily};
  padding: 0.75rem;
  margin-bottom: 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: ${({ $isError }) => ($isError ? "#ffebee" : "#e8f5e8")};
  border: 1px solid
    ${({ $isError }) => ($isError ? COLORS.red : COLORS.adlr_green)};
`;

// Heading Components
export const Heading = styled.h2`
  font-family: ${Sans.style.fontFamily};
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const Underline = styled.div`
  width: 8rem;
  height: 0.1875rem;
  background-color: ${COLORS.adlr_green};
  margin-bottom: 1.875rem;
`;

// Input Components
export const InputGroup = styled.div<{ $marginSmall?: boolean }>`
  margin-bottom: ${({ $marginSmall }) =>
    $marginSmall ? "0.75rem" : "1.25rem"};
`;

export const Label = styled.label`
  font-family: ${Sans.style.fontFamily};
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const RequiredAsterisk = styled.span`
  color: ${COLORS.red};
`;

export const Input = styled.input`
  font-family: ${Sans.style.fontFamily};
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.adlr_green};
  }
`;

// Button Components
export const PrimaryButton = styled.button<{
  disabled?: boolean;
  $marginBottom?: boolean;
}>`
  font-family: ${Sans.style.fontFamily};
  background-color: ${({ disabled }) =>
    disabled ? COLORS.adlr_blue : COLORS.adlr_navy};
  color: ${COLORS.white};
  font-size: 1.125rem;
  font-weight: 500;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  width: 100%;
  transition: background-color 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  margin-bottom: ${({ $marginBottom }) => ($marginBottom ? "0.75rem" : "0")};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? COLORS.adlr_blue : COLORS.adlr_forest_green};
  }
`;

export const SecondaryButton = styled.button<{
  disabled?: boolean;
  $marginTop?: boolean;
}>`
  font-family: ${Sans.style.fontFamily};
  background-color: transparent;
  color: ${COLORS.adlr_navy};
  font-size: 1.125rem;
  font-weight: 500;
  padding: 0.875rem;
  border: 2px solid ${COLORS.adlr_navy};
  border-radius: 0.5rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  width: 100%;
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  margin-top: ${({ $marginTop }) => ($marginTop ? "0.75rem" : "0")};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : COLORS.adlr_navy};
    color: ${({ disabled }) => (disabled ? COLORS.adlr_navy : COLORS.white)};
  }
`;

export const LinkButton = styled.button`
  font-family: ${Sans.style.fontFamily};
  background: none;
  border: none;
  color: ${COLORS.adlr_green};
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  padding: 0;
  text-decoration: none !important;
  margin-bottom: 1.5rem;
  display: block;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.adlr_forest_green};
    text-decoration: underline !important;
  }
`;

// Link Components
export const LinkContainer = styled.div`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.white};
  font-size: 1rem;
`;

export const StyledLink = styled(Link)`
  font-family: ${Sans.style.fontFamily};
  background: none;
  border: none;
  color: ${COLORS.adlr_green};
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  text-decoration: none !important;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.adlr_forest_green};
    text-decoration: underline !important;
  }
`;

// Wrapper for Link components to remove default styling
export const LinkWrapper = styled.div`
  a {
    text-decoration: none !important;
  }
`;

// Verification Page Components
export const VerificationText = styled.p`
  font-family: ${Sans.style.fontFamily};
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;

export const EmailDisplay = styled.div`
  font-family: ${Sans.style.fontFamily};
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

export const ResendContainer = styled.div`
  font-family: ${Sans.style.fontFamily};
  text-align: center;
  font-size: 1rem;
  color: #333;
  margin-top: 1rem;
`;

export const ResendLink = styled.button<{ disabled?: boolean }>`
  font-family: ${Sans.style.fontFamily};
  background: none;
  border: none;
  color: ${({ disabled }) => (disabled ? "#999" : COLORS.adlr_green)};
  font-size: 1rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  padding: 0;
  text-decoration: none !important;
  font-weight: 500;
  transition: color 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    color: ${({ disabled }) => (disabled ? "#999" : COLORS.adlr_forest_green)};
    text-decoration: ${({ disabled }) =>
      disabled ? "none" : "underline"} !important;
  }
`;
