"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import { handleAuthError } from "@/lib/utils";
import * as S from "../styles";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSignUp = async () => {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    setSuccessMessage("");

    // Client-side validation
    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const data = await signUp(email, password);

      // Check if user already exists - Supabase may not throw an error but returns specific data
      if (data?.user) {
        // If user exists and email is already confirmed, they're trying to sign up again
        if (data.user.identities && data.user.identities.length === 0) {
          setEmailError(
            "An account with this email already exists. Please use the sign in button instead.",
          );
          return;
        }

        // Check if email confirmation is required
        if (data.session) {
          // Email confirmation is disabled - user is logged in immediately
          // Redirect directly to account details page
          router.push("/account_details");
        } else {
          // Email confirmation is enabled - user needs to verify email
          // Redirect to verification page
          router.push(
            `/verification_needed?email=${encodeURIComponent(email)}`,
          );
        }
      }

      return data;
    } catch (error) {
      const errorMsg = handleAuthError(error, "signUp");
      // Try to determine which field the error relates to
      if (errorMsg.includes("email") || errorMsg.includes("Email")) {
        setEmailError(errorMsg);
      } else if (
        errorMsg.includes("password") ||
        errorMsg.includes("Password")
      ) {
        setPasswordError(errorMsg);
      } else {
        // Generic error - show on email field
        setEmailError(errorMsg);
      }
      return;
    }
  };

  return (
    <S.Container>
      {/* Logo */}
      <S.Logo
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
      />

      {/* Sign Up Card */}
      <S.Card>
        {successMessage && (
          <S.Message $isError={false}>{successMessage}</S.Message>
        )}

        <S.Heading>
          Sign Up
          <S.Underline />
        </S.Heading>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <S.InputGroup>
            <S.Label>
              Email<S.RequiredAsterisk>*</S.RequiredAsterisk>
            </S.Label>
            <S.Input
              name="email"
              type="email"
              placeholder=""
              onChange={e => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              value={email}
              $hasError={!!emailError}
            />
            {emailError && <S.ErrorText>{emailError}</S.ErrorText>}
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>
              Password<S.RequiredAsterisk>*</S.RequiredAsterisk>
            </S.Label>
            <S.Input
              type="password"
              name="password"
              placeholder=""
              onChange={e => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
                if (confirmPasswordError) setConfirmPasswordError(""); // Clear confirm password error on password change
              }}
              value={password}
              $hasError={!!passwordError}
            />
            {passwordError && <S.ErrorText>{passwordError}</S.ErrorText>}
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>
              Confirm Password<S.RequiredAsterisk>*</S.RequiredAsterisk>
            </S.Label>
            <S.Input
              type="password"
              name="confirmPassword"
              placeholder=""
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError(""); // Clear error on input change
              }}
              value={confirmPassword}
              $hasError={!!confirmPasswordError}
            />
            {confirmPasswordError && (
              <S.ErrorText>{confirmPasswordError}</S.ErrorText>
            )}
          </S.InputGroup>

          <S.PrimaryButton type="submit" onClick={handleSignUp}>
            Sign Up
          </S.PrimaryButton>
        </form>

        {/* Login link */}
        <S.LinkContainer>
          <S.StyledLink href="/login">Go Back to Login</S.StyledLink>
        </S.LinkContainer>
      </S.Card>
    </S.Container>
  );
}
