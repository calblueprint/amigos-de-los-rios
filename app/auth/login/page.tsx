"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    // Client-side validation
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      const data = await signIn(email, password);

      if (data?.user) {
        setMessage("Sign in successful! Welcome back.");
        // Redirect to home page or dashboard
        router.push("/");
      }

      return data;
    } catch (error) {
      // Handle specific Supabase error messages
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      if (
        errorMessage.includes("Invalid login credentials") ||
        errorMessage.includes("wrong password") ||
        errorMessage.includes("invalid password")
      ) {
        setMessage(
          "Invalid email or password. Please check your credentials and try again.",
        );
      } else if (errorMessage.includes("Email not confirmed")) {
        setMessage(
          "Please check your email and click the confirmation link before signing in.",
        );
      } else if (errorMessage.includes("User not found")) {
        setMessage("No account found with this email. Please sign up first.");
      } else if (errorMessage.includes("Too many requests")) {
        setMessage(
          "Too many failed attempts. Please wait a moment before trying again.",
        );
      } else if (errorMessage.includes("Invalid email")) {
        setMessage("Please enter a valid email address");
      } else {
        setMessage(`Sign in error: ${errorMessage}`);
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

      {/* Login Card */}
      <S.Card>
        {message && (
          <S.Message
            $isError={message.includes("Error") || message.includes("error")}
          >
            {message}
          </S.Message>
        )}

        <S.Heading>Login</S.Heading>
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

        <S.InputGroup $marginSmall>
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

        <Link href="/auth/reset_password">
          <S.LinkButton type="button">Forgot password?</S.LinkButton>
        </Link>

        <S.PrimaryButton type="button" onClick={handleSignIn}>
          Login
        </S.PrimaryButton>
      </S.Card>

      {/* Sign up link */}
      <S.LinkContainer>
        No account?{" "}
        <Link href="/auth/sign_up" passHref legacyBehavior>
          <S.StyledLink>Sign up</S.StyledLink>
        </Link>
      </S.LinkContainer>
    </S.Container>
  );
}
