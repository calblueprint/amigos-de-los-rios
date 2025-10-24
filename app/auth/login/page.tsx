"use client";

import { useState } from "react";
import Image from "next/image";
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
    <div style={S.containerStyle}>
      {/* Logo */}
      <Image
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
        style={S.logoStyle}
      />

      {/* Login Card */}
      <div style={S.cardStyle}>
        {message && (
          <div
            style={{
              ...S.messageStyle,
              ...(message.includes("Error") || message.includes("error")
                ? S.errorMessageStyle
                : S.successMessageStyle),
            }}
          >
            {message}
          </div>
        )}

        <h2 style={S.headingStyle}>Login</h2>
        <div style={S.underlineStyle} />

        <div style={S.inputGroupStyle}>
          <label style={S.labelStyle}>
            Email<span style={S.requiredAsteriskStyle}>*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder=""
            onChange={e => setEmail(e.target.value)}
            value={email}
            style={S.inputStyle}
          />
        </div>

        <div style={S.inputGroupSmallStyle}>
          <label style={S.labelStyle}>
            Password<span style={S.requiredAsteriskStyle}>*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder=""
            onChange={e => setPassword(e.target.value)}
            value={password}
            style={S.inputStyle}
          />
        </div>

        <Link href="/auth/reset_password">
          <S.LinkButton type="button">Forgot password?</S.LinkButton>
        </Link>

        <S.PrimaryButton type="button" onClick={handleSignIn}>
          Login
        </S.PrimaryButton>
      </div>

      {/* Sign up link */}
      <div style={S.linkContainerStyle}>
        No account?{" "}
        <Link href="/auth/sign_up" style={S.linkButtonStyle}>
          Sign up
        </Link>
      </div>
    </div>
  );
}
