"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  resetPasswordForEmail,
  updateUserPassword,
} from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Check if user is in password reset flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("reset") === "true") {
      setIsResettingPassword(true);
      setMessage("Please enter your new password below");
    }
  }, []);

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      await resetPasswordForEmail(
        email,
        `${window.location.origin}/auth/reset_password?reset=true`,
      );

      setMessage(
        "Password reset email sent! Check your inbox and click the link.",
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessage(`Error: ${errorMessage}`);
      return;
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    try {
      await updateUserPassword(newPassword);

      setMessage(
        "Password updated successfully! You can now log in with your new password.",
      );
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessage(`Error: ${errorMessage}`);
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

      {/* Reset Password Card */}
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

        {isResettingPassword ? (
          // Password update form (after clicking link in email)
          <>
            <h2 style={S.headingStyle}>Set New Password</h2>
            <div style={S.underlineStyle} />

            <div style={S.inputGroupStyle}>
              <label style={S.labelStyle}>
                New Password<span style={S.requiredAsteriskStyle}>*</span>
              </label>
              <input
                type="password"
                placeholder=""
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
                style={S.inputStyle}
              />
            </div>

            <div style={S.inputGroupStyle}>
              <label style={S.labelStyle}>
                Confirm New Password
                <span style={S.requiredAsteriskStyle}>*</span>
              </label>
              <input
                type="password"
                placeholder=""
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                style={S.inputStyle}
              />
            </div>

            <S.PrimaryButton
              type="button"
              onClick={handleUpdatePassword}
              style={{ marginBottom: "0.75rem" }}
            >
              Update Password
            </S.PrimaryButton>
            <Link href="/auth/login">
              <S.SecondaryButton type="button">Cancel</S.SecondaryButton>
            </Link>
          </>
        ) : (
          // Forgot password form (request reset link)
          <>
            <h2 style={S.headingStyle}>Reset Password</h2>
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

            <S.PrimaryButton type="button" onClick={handleResetPassword}>
              Send Reset Link
            </S.PrimaryButton>

            <Link href="/auth/login">
              <S.SecondaryButton type="button" style={{ marginTop: "0.75rem" }}>
                Back to Login
              </S.SecondaryButton>
            </Link>
          </>
        )}
      </div>

      {/* Login link */}
      {!isResettingPassword && (
        <div style={S.linkContainerStyle}>
          Remember your password?{" "}
          <Link href="/auth/login" style={S.linkButtonStyle}>
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
