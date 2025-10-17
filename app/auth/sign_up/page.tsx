"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import supabase from "../../../actions/supabase/client";
import whiteLogo from "../../../assets/images/white_logo.svg";
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Handle specific Supabase error messages
      if (error.message.includes("User already registered")) {
        setMessage(
          "An account with this email already exists. Please use the sign in button instead.",
        );
      } else if (error.message.includes("Password should be at least")) {
        setMessage("Password must be at least 8 characters long");
      } else if (error.message.includes("Invalid email")) {
        setMessage("Please enter a valid email address");
      } else if (
        error.message.includes("Password is too weak") ||
        error.message.includes("weak password")
      ) {
        setMessage(
          "Password is too weak. Please use a stronger password with a mix of letters, numbers, and symbols.",
        );
      } else if (error.message.includes("password")) {
        setMessage(
          "Password doesn't meet security requirements. Please use at least 8 characters.",
        );
      } else {
        setMessage(`Sign up error: ${error.message}`);
      }
      return;
    }

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

      {/* Sign Up Card */}
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

        <h2 style={S.headingStyle}>Sign Up</h2>
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

        <div style={S.inputGroupStyle}>
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

        <S.PrimaryButton type="button" onClick={handleSignUp}>
          Sign Up
        </S.PrimaryButton>
      </div>

      {/* Login link */}
      <div style={S.linkContainerStyle}>
        Already have an account?{" "}
        <Link href="/auth/login" style={S.linkButtonStyle}>
          Login
        </Link>
      </div>
    </div>
  );
}
