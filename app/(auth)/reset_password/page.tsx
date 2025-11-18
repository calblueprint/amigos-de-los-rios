"use client";

import { useState } from "react";
import Image from "next/image";
import { resetPasswordForEmail } from "@/actions/supabase/queries/auth";
import greenCheck from "@/assets/images/green-check.svg";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      setIsError(true);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setIsError(true);
      return;
    }

    try {
      await resetPasswordForEmail(
        email,
        `${window.location.origin}/set_new_password`,
      );

      setEmailSent(true);
      setIsError(false);
      setMessage("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      // Show user-friendly error message
      if (errorMessage.includes("not found") || errorMessage.includes("User")) {
        setMessage("Email not found");
      } else {
        setMessage(errorMessage);
      }
      setIsError(true);
      return;
    }
  };

  const handleResendEmail = async () => {
    await handleResetPassword();
  };

  const handleGoBack = () => {
    setEmailSent(false);
    setEmail("");
    setMessage("");
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

      {/* Reset Password Card */}
      <S.Card>
        {emailSent ? (
          // Success View
          <>
            <S.Heading>
              Reset Password
              <S.Underline />
            </S.Heading>

            <S.SuccessIconContainer>
              <Image src={greenCheck} alt="Success" width={80} height={80} />
            </S.SuccessIconContainer>

            <S.SuccessHeading>Email Sent!</S.SuccessHeading>

            <S.SuccessMessage>
              We&apos;ve sent you a password reset link!
              <br />
              This link will expire in 15 minutes.
            </S.SuccessMessage>

            <S.PrimaryButton type="button" onClick={handleResendEmail}>
              Resend Email
            </S.PrimaryButton>
          </>
        ) : (
          // Email Input View
          <>
            <S.Heading>
              Reset Password
              <S.Underline />
            </S.Heading>

            <S.InputGroup>
              <S.Label>
                Account Email<S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                name="email"
                type="email"
                placeholder=""
                onChange={e => {
                  setEmail(e.target.value);
                  if (message) {
                    setMessage("");
                    setIsError(false);
                  }
                }}
                value={email}
                $hasError={isError}
              />
              {isError && message && <S.ErrorText>{message}</S.ErrorText>}
            </S.InputGroup>

            <S.PrimaryButton type="button" onClick={handleResetPassword}>
              Confirm
            </S.PrimaryButton>
          </>
        )}
        {/* Bottom link */}
        {emailSent ? (
          <S.LinkContainer>
            <S.StyledLink href="/reset_password" onClick={handleGoBack}>
              Go Back
            </S.StyledLink>
          </S.LinkContainer>
        ) : (
          <S.LinkContainer>
            Remember your password?&nbsp;
            <S.StyledLink href="/login">Login</S.StyledLink>
          </S.LinkContainer>
        )}
      </S.Card>
    </S.Container>
  );
}
