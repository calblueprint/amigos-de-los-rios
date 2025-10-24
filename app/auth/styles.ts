import { CSSProperties } from "react";
import { DM_Sans } from "next/font/google";
import styled from "styled-components";
import COLORS from "@/styles/colors";

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const containerStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: COLORS.adlr_blue,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.25rem",
  gap: "2.5rem",
};

export const logoStyle: CSSProperties = {
  objectFit: "contain",
};

export const cardStyle: CSSProperties = {
  backgroundColor: COLORS.white,
  borderRadius: "1rem",
  padding: "2.5rem",
  maxWidth: "27.5rem",
  width: "100%",
  boxShadow: "0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)",
};

export const messageStyle: CSSProperties = {
  padding: "0.75rem",
  marginBottom: "1.25rem",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  fontFamily: "DM Sans, sans-serif",
};

export const errorMessageStyle: CSSProperties = {
  backgroundColor: "#ffebee",
  border: "1px solid COLORS.red",
};

export const successMessageStyle: CSSProperties = {
  backgroundColor: "#e8f5e8",
  border: "1px solid colors.adlr_green",
};

export const headingStyle: CSSProperties = {
  fontSize: "2rem",
  fontWeight: "500",
  marginBottom: "0.5rem",
  color: "#333",
  fontFamily: "DM Sans, sans-serif",
};

export const underlineStyle: CSSProperties = {
  width: "8rem",
  height: "0.1875rem",
  backgroundColor: COLORS.adlr_green,
  marginBottom: "1.875rem",
};

export const inputGroupStyle: CSSProperties = {
  marginBottom: "1.25rem",
};

export const inputGroupSmallStyle: CSSProperties = {
  marginBottom: "0.75rem",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "1rem",
  marginBottom: "0.5rem",
  color: "#333",
  fontFamily: "DM Sans, sans-serif",
};

export const requiredAsteriskStyle: CSSProperties = {
  color: COLORS.red,
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "0.5rem",
  boxSizing: "border-box",
  fontFamily: "DM Sans, sans-serif",
};

export const forgotPasswordButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: COLORS.adlr_green,
  fontSize: "0.875rem",
  cursor: "pointer",
  padding: "0",
  textDecoration: "none",
  marginBottom: "1.5rem",
  display: "block",
  fontFamily: "DM Sans, sans-serif",
};

export const primaryButtonStyle: CSSProperties = {
  width: "100%",
  padding: "0.875rem",
  fontSize: "1.125rem",
  fontWeight: "500",
  color: COLORS.white,
  backgroundColor: COLORS.adlr_navy,
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontFamily: "DM Sans, sans-serif",
};

export const primaryButtonWithMarginStyle: CSSProperties = {
  width: "100%",
  padding: "0.875rem",
  fontSize: "1.125rem",
  fontWeight: "500",
  color: COLORS.white,
  backgroundColor: COLORS.adlr_navy,
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  marginBottom: "0.75rem",
  fontFamily: "DM Sans, sans-serif",
};

export const secondaryButtonStyle: CSSProperties = {
  width: "100%",
  padding: "0.875rem",
  fontSize: "1.125rem",
  fontWeight: "500",
  color: COLORS.adlr_navy,
  backgroundColor: "transparent",
  border: `2px solid ${COLORS.adlr_navy}`,
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontFamily: "DM Sans, sans-serif",
};

export const secondaryButtonWithMarginStyle: CSSProperties = {
  width: "100%",
  padding: "0.875rem",
  fontSize: "1.125rem",
  fontWeight: "500",
  color: COLORS.adlr_navy,
  backgroundColor: "transparent",
  border: `2px solid ${COLORS.adlr_navy}`,
  borderRadius: "0.5rem",
  cursor: "pointer",
  marginTop: "0.75rem",
  fontFamily: "DM Sans, sans-serif",
};

export const linkContainerStyle: CSSProperties = {
  color: COLORS.white,
  fontSize: "1rem",
  fontFamily: "DM Sans, sans-serif",
};

export const linkButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: COLORS.adlr_green,
  fontSize: "1rem",
  cursor: "pointer",
  padding: "0",
  textDecoration: "none",
  fontWeight: "500",
  fontFamily: "DM Sans, sans-serif",
};

// Styled Components for Buttons
export const PrimaryButton = styled.button<{ disabled?: boolean }>`
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

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? COLORS.adlr_blue : COLORS.adlr_forest_green};
  }
`;

export const SecondaryButton = styled.button<{ disabled?: boolean }>`
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
  text-decoration: none;
  margin-bottom: 1.5rem;
  display: block;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.adlr_forest_green};
    text-decoration: underline;
  }
`;
