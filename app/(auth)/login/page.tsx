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
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
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

    try {
      const data = await signIn(email, password);

      if (data?.user) {
        setMessage("Sign in successful! Welcome back.");
        setIsError(false);
        // Redirect to home page or dashboard
        router.push("/");
      }

      return data;
    } catch (error) {
      setMessage(handleAuthError(error, "signIn"));
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

      {/* Login Card */}
      <S.Card>
        {message && <S.Message $isError={isError}>{message}</S.Message>}

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

        <S.LinkWrapper>
          <Link href="/reset_password">
            <S.LinkButton type="button">Forgot password?</S.LinkButton>
          </Link>
        </S.LinkWrapper>

        <S.PrimaryButton type="button" onClick={handleSignIn}>
          Login
        </S.PrimaryButton>
      </S.Card>

      {/* Sign up link */}
      <S.LinkContainer>
        No account?{" "}
        <Link href="/sign_up" passHref legacyBehavior>
          <S.StyledLink>Sign up</S.StyledLink>
        </Link>
      </S.LinkContainer>
    </S.Container>
  );
}
