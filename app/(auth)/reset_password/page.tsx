"use client";

import { useEffect, useState } from "react";
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
        {message && (
          <S.Message
            $isError={message.includes("Error") || message.includes("error")}
          >
            {message}
          </S.Message>
        )}

        {isResettingPassword ? (
          // Password update form (after clicking link in email)
          <>
            <S.Heading>Set New Password</S.Heading>
            <S.Underline />

            <S.InputGroup>
              <S.Label>
                New Password<S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                type="password"
                placeholder=""
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>
                Confirm New Password
                <S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                type="password"
                placeholder=""
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </S.InputGroup>

            <S.PrimaryButton
              type="button"
              onClick={handleUpdatePassword}
              $marginBottom
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

            <Link href="/auth/login">
              <S.SecondaryButton type="button" $marginTop>
                Back to Login
              </S.SecondaryButton>
            </Link>
          </>
        )}
      </S.Card>

      {/* Login link */}
      {!isResettingPassword && (
        <S.LinkContainer>
          Remember your password?{" "}
          <Link href="/auth/login" passHref legacyBehavior>
            <S.StyledLink>Login</S.StyledLink>
          </Link>
        </S.LinkContainer>
      )}
    </S.Container>
  );
}
