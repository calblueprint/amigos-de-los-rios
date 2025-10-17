"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import supabase from "../../../actions/supabase/client";
import whiteLogo from "../../../assets/images/white_logo.svg";
import { authStyles } from "../styles";

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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset_password?reset=true`,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage(
      "Password reset email sent! Check your inbox and click the link.",
    );
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

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Password updated successfully! You can now log in with your new password.");
    setNewPassword("");
    setConfirmPassword("");
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 2000);
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

      {/* Reset Password Card */}
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

        {isResettingPassword ? (
          // Password update form (after clicking link in email)
          <>
            <h2 style={authStyles.heading}>Set New Password</h2>
            <div style={authStyles.underline} />

            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>
                New Password<span style={authStyles.requiredAsterisk}>*</span>
              </label>
              <input
                type="password"
                placeholder=""
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
                style={authStyles.input}
              />
            </div>

            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>
                Confirm New Password
                <span style={authStyles.requiredAsterisk}>*</span>
              </label>
              <input
                type="password"
                placeholder=""
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                style={authStyles.input}
              />
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              style={authStyles.primaryButtonWithMargin}
            >
              Update Password
            </button>
            <Link href="/auth/login">
              <button type="button" style={authStyles.secondaryButton}>
                Cancel
              </button>
            </Link>
          </>
        ) : (
          // Forgot password form (request reset link)
          <>
            <h2 style={authStyles.heading}>Reset Password</h2>
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

            <button
              type="button"
              onClick={handleResetPassword}
              style={authStyles.primaryButton}
            >
              Send Reset Link
            </button>

            <Link href="/auth/login">
              <button
                type="button"
                style={authStyles.secondaryButtonWithMargin}
              >
                Back to Login
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Login link */}
      {!isResettingPassword && (
        <div style={authStyles.linkContainer}>
          Remember your password?{" "}
          <Link href="/auth/login" style={authStyles.linkButton}>
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

