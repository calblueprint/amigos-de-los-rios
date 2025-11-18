"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import { handleAuthError } from "@/lib/utils";
import * as S from "../styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

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
      setPasswordError("Please enter your password");
      return;
    }

    try {
      const data = await signIn(email, password);

      if (data?.user) {
        // Redirect to home page or dashboard
        router.push("/");
      }

      return data;
    } catch (error) {
      const errorMsg = handleAuthError(error, "signIn");
      // Try to determine which field the error relates to
      if (errorMsg.includes("email") || errorMsg.includes("Email")) {
        setEmailError(errorMsg);
      } else if (
        errorMsg.includes("password") ||
        errorMsg.includes("Password")
      ) {
        setPasswordError(errorMsg);
      } else {
        // Generic error - show on password field
        setPasswordError(errorMsg);
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
        <S.Heading>
          Login
          <S.Underline />
        </S.Heading>

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

        <S.InputGroup $marginSmall>
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
            }}
            value={password}
            $hasError={!!passwordError}
          />
          {passwordError && <S.ErrorText>{passwordError}</S.ErrorText>}
        </S.InputGroup>

        <S.LinkWrapper>
          <Link href="/reset_password">
            <S.LinkButton type="button">Forgot password?</S.LinkButton>
          </Link>
        </S.LinkWrapper>

        <S.PrimaryButton type="button" onClick={handleSignIn}>
          Login
        </S.PrimaryButton>

        {/* Sign up link */}
        <S.LinkContainer>
          No account?&nbsp;<S.StyledLink href="/sign_up">Sign up</S.StyledLink>
        </S.LinkContainer>
      </S.Card>
    </S.Container>
  );
}
