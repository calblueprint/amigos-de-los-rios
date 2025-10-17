"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "../../../actions/supabase/client";
import whiteLogo from "../../../assets/images/white_logo.svg";
import { authStyles } from "../styles";

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Handle specific Supabase error messages
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("wrong password") ||
        error.message.includes("invalid password")
      ) {
        setMessage(
          "Invalid email or password. Please check your credentials and try again.",
        );
      } else if (error.message.includes("Email not confirmed")) {
        setMessage(
          "Please check your email and click the confirmation link before signing in.",
        );
      } else if (error.message.includes("User not found")) {
        setMessage("No account found with this email. Please sign up first.");
      } else if (error.message.includes("Too many requests")) {
        setMessage(
          "Too many failed attempts. Please wait a moment before trying again.",
        );
      } else if (error.message.includes("Invalid email")) {
        setMessage("Please enter a valid email address");
      } else {
        setMessage(`Sign in error: ${error.message}`);
      }
      return;
    }

    if (data?.user) {
      setMessage("Sign in successful! Welcome back.");
      // Redirect to home page or dashboard
      router.push("/");
    }

    return data;
  };

  return (
    <div style={authStyles.container}>
      {/* Logo */}
      <Image
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
        style={authStyles.logo}
      />

      {/* Login Card */}
      <div style={authStyles.card}>
        {message && (
          <div
            style={{
              ...authStyles.message,
              ...(message.includes("Error") || message.includes("error")
                ? authStyles.errorMessage
                : authStyles.successMessage),
            }}
          >
            {message}
          </div>
        )}

        <h2 style={authStyles.heading}>Login</h2>
        <div style={authStyles.underline} />

        <div style={authStyles.inputGroup}>
          <label style={authStyles.label}>
            Email<span style={authStyles.requiredAsterisk}>*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder=""
            onChange={e => setEmail(e.target.value)}
            value={email}
            style={authStyles.input}
          />
        </div>

        <div style={authStyles.inputGroupSmall}>
          <label style={authStyles.label}>
            Password<span style={authStyles.requiredAsterisk}>*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder=""
            onChange={e => setPassword(e.target.value)}
            value={password}
            style={authStyles.input}
          />
        </div>

        <Link href="/auth/reset_password" style={authStyles.forgotPasswordButton}>
          Forgot password?
        </Link>

        <button
          type="button"
          onClick={handleSignIn}
          style={authStyles.primaryButton}
        >
          Login
        </button>
      </div>

      {/* Sign up link */}
      <div style={authStyles.linkContainer}>
        No account?{" "}
        <Link href="/auth/sign_up" style={authStyles.linkButton}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

