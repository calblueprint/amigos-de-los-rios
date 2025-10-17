"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    // Client-side validation
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
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
          return;
        }

        // New user successfully created
        setMessage(
          "Sign up successful! Please check your email for confirmation link.",
        );
      }

      return data;
    } catch (error) {
      // Handle specific Supabase error messages
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      if (errorMessage.includes("User already registered")) {
        setMessage(
          "An account with this email already exists. Please use the sign in button instead.",
        );
      } else if (errorMessage.includes("Password should be at least")) {
        setMessage("Password must be at least 8 characters long");
      } else if (errorMessage.includes("Invalid email")) {
        setMessage("Please enter a valid email address");
      } else if (
        errorMessage.includes("Password is too weak") ||
        errorMessage.includes("weak password")
      ) {
        setMessage(
          "Password is too weak. Please use a stronger password with a mix of letters, numbers, and symbols.",
        );
      } else if (errorMessage.includes("password")) {
        setMessage(
          "Password doesn't meet security requirements. Please use at least 8 characters.",
        );
      } else {
        setMessage(`Sign up error: ${errorMessage}`);
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
        {message && (
          <S.Message
            $isError={message.includes("Error") || message.includes("error")}
          >
            {message}
          </S.Message>
        )}

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
        <Link href="/auth/login" passHref legacyBehavior>
          <S.StyledLink>Login</S.StyledLink>
        </Link>
      </S.LinkContainer>
    </S.Container>
  );
}
