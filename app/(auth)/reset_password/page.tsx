"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPasswordForEmail } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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

      setMessage(
        "Password reset email sent! Check your inbox and click the link.",
      );
      setIsError(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessage(`Error: ${errorMessage}`);
      setIsError(true);
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

      {/* Reset Password Card */}
      <S.Card>
        {message && <S.Message $isError={isError}>{message}</S.Message>}

        <S.Heading>Reset Password</S.Heading>
        <S.Underline />

        <S.InputGroup>
          <S.Label>
            Email<S.RequiredAsterisk>*</S.RequiredAsterisk>
          </S.Label>
          <S.Input
            name="email"
            type="email"
            placeholder=""
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </S.InputGroup>

        <S.PrimaryButton type="button" onClick={handleResetPassword}>
          Send Reset Link
        </S.PrimaryButton>

        <Link href="/login">
          <S.SecondaryButton type="button" $marginTop>
            Back to Login
          </S.SecondaryButton>
        </Link>
      </S.Card>

      {/* Login link */}
      <S.LinkContainer>
        Remember your password? <S.StyledLink href="/login">Login</S.StyledLink>
      </S.LinkContainer>
    </S.Container>
  );
}
