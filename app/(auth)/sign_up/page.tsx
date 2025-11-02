"use client";

import { useState } from "react";
import { signUp } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import { handleAuthError } from "@/lib/utils";
import * as S from "../styles";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSignUp = async () => {
    // Client-side validation
    if (!email || !password) {
      setMessage("Please fill in all fields");
      setIsError(true);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setIsError(true);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setIsError(true);
      return;
    }

    try {
      const data = await signUp(email, password);

      // Check if user already exists - Supabase may not throw an error but returns specific data
      if (data?.user) {
        // If user exists and email is already confirmed, they're trying to sign up again
        if (data.user.identities && data.user.identities.length === 0) {
          setMessage(
            "An account with this email already exists. Please use the sign in button instead.",
          );
          setIsError(true);
          return;
        }

        // New user successfully created
        setMessage(
          "Sign up successful! Please check your email for confirmation link.",
        );
        setIsError(false);
      }

      return data;
    } catch (error) {
      setMessage(handleAuthError(error, "signUp"));
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

      {/* Sign Up Card */}
      <S.Card>
        {message && <S.Message $isError={isError}>{message}</S.Message>}

        <S.Heading>Sign Up</S.Heading>
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

        <S.InputGroup>
          <S.Label>
            Password<S.RequiredAsterisk>*</S.RequiredAsterisk>
          </S.Label>
          <S.Input
            type="password"
            name="password"
            placeholder=""
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </S.InputGroup>

        <S.PrimaryButton type="button" onClick={handleSignUp}>
          Sign Up
        </S.PrimaryButton>
      </S.Card>

      {/* Login link */}
      <S.LinkContainer>
        Already have an account?{" "}
        <S.StyledLink href="/login">Login</S.StyledLink>
      </S.LinkContainer>
    </S.Container>
  );
}
