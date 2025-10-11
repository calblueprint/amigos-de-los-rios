import { CSSProperties } from "react";
import COLORS from "../../styles/colors";

export const loginStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: COLORS.adlr_blue,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.25rem",
    gap: "2.5rem",
  } as CSSProperties,

  logo: {
    objectFit: "contain",
  } as CSSProperties,

  card: {
    backgroundColor: COLORS.white,
    borderRadius: "1rem",
    padding: "2.5rem",
    maxWidth: "27.5rem",
    width: "100%",
    boxShadow: "0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)",
  } as CSSProperties,

  message: {
    padding: "0.75rem",
    marginBottom: "1.25rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
  } as CSSProperties,

  errorMessage: {
    backgroundColor: "#ffebee",
    border: "1px solid COLORS.red",
  } as CSSProperties,

  successMessage: {
    backgroundColor: "#e8f5e8",
    border: "1px solid colors.adlr_green",
  } as CSSProperties,

  heading: {
    fontSize: "2rem",
    fontWeight: "400",
    marginBottom: "0.5rem",
    color: "#333",
  } as CSSProperties,

  underline: {
    width: "3.75rem",
    height: "0.1875rem",
    backgroundColor: COLORS.adlr_green,
    marginBottom: "1.875rem",
  } as CSSProperties,

  inputGroup: {
    marginBottom: "1.25rem",
  } as CSSProperties,

  inputGroupSmall: {
    marginBottom: "0.75rem",
  } as CSSProperties,

  label: {
    display: "block",
    fontSize: "1rem",
    marginBottom: "0.5rem",
    color: "#333",
  } as CSSProperties,

  requiredAsterisk: {
    color: COLORS.red,
  } as CSSProperties,

  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "0.5rem",
    boxSizing: "border-box",
  } as CSSProperties,

  forgotPasswordButton: {
    background: "none",
    border: "none",
    color: COLORS.adlr_green,
    fontSize: "0.875rem",
    cursor: "pointer",
    padding: "0",
    textDecoration: "none",
    marginBottom: "1.5rem",
    display: "block",
  } as CSSProperties,

  primaryButton: {
    width: "100%",
    padding: "0.875rem",
    fontSize: "1.125rem",
    fontWeight: "500",
    color: COLORS.white,
    backgroundColor: COLORS.adlr_navy,
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  } as CSSProperties,

  primaryButtonWithMargin: {
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
  } as CSSProperties,

  secondaryButton: {
    width: "100%",
    padding: "0.875rem",
    fontSize: "1.125rem",
    fontWeight: "500",
    color: COLORS.adlr_navy,
    backgroundColor: "transparent",
    border: `2px solid ${COLORS.adlr_navy}`,
    borderRadius: "0.5rem",
    cursor: "pointer",
  } as CSSProperties,

  secondaryButtonWithMargin: {
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
  } as CSSProperties,

  signUpContainer: {
    marginTop: "1.5rem",
    color: COLORS.white,
    fontSize: "1rem",
  } as CSSProperties,

  signUpButton: {
    background: "none",
    border: "none",
    color: COLORS.adlr_green,
    fontSize: "1rem",
    cursor: "pointer",
    padding: "0",
    textDecoration: "none",
    fontWeight: "500",
  } as CSSProperties,
};
