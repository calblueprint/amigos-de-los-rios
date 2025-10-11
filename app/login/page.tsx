"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "../../actions/supabase/client";
import whiteLogo from "../../assets/images/white_logo.png";
import { loginStyles } from "./styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [message, setMessage] = useState("");

  // Check if user is in password reset flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("reset") === "true") {
      setIsResettingPassword(true);
      setMessage("Please enter your new password below");
    }
  }, []);

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
    }

    return data;
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(`Error signing out: ${error.message}`);
      return;
    }

    setMessage("Sign out successful! See you next time.");
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
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

    setMessage("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={loginStyles.container}>
      {/* Logo */}
      <Image
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
        style={loginStyles.logo}
      />

      {/* Login Card */}
      <div style={loginStyles.card}>
        {message && (
          <div
            style={{
              ...loginStyles.message,
              ...(message.includes("Error")
                ? loginStyles.errorMessage
                : loginStyles.successMessage),
            }}
          >
            {message}
          </div>
        )}

        {isResettingPassword ? (
          // Password reset form
          <>
            <h2 style={loginStyles.heading}>Set New Password</h2>
            <div style={loginStyles.underline} />

            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>
                New Password<span style={loginStyles.requiredAsterisk}>*</span>
              </label>
              <input
                type="password"
                placeholder=""
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
                style={loginStyles.input}
              />
            </div>

            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>
                Confirm New Password
                <span style={loginStyles.requiredAsterisk}>*</span>
              </label>
              <input
                type="password"
                placeholder=""
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                style={loginStyles.input}
              />
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              style={loginStyles.primaryButtonWithMargin}
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => setIsResettingPassword(false)}
              style={loginStyles.secondaryButton}
            >
              Cancel
            </button>
          </>
        ) : (
          // Regular login/signup form
          <>
            <h2 style={loginStyles.heading}>
              {isForgotPasswordMode
                ? "Reset Password"
                : isSignUpMode
                  ? "Sign Up"
                  : "Login"}
            </h2>
            <div style={loginStyles.underline} />

            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>
                Email<span style={loginStyles.requiredAsterisk}>*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder=""
                onChange={e => setEmail(e.target.value)}
                value={email}
                style={loginStyles.input}
              />
            </div>

            {!isForgotPasswordMode && (
              <div style={loginStyles.inputGroupSmall}>
                <label style={loginStyles.label}>
                  Password<span style={loginStyles.requiredAsterisk}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder=""
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  style={loginStyles.input}
                />
              </div>
            )}

            {!isSignUpMode && !isForgotPasswordMode && (
              <button
                type="button"
                onClick={() => setIsForgotPasswordMode(true)}
                style={loginStyles.forgotPasswordButton}
              >
                Forgot password?
              </button>
            )}

            <button
              type="button"
              onClick={
                isForgotPasswordMode
                  ? handleResetPassword
                  : isSignUpMode
                    ? handleSignUp
                    : handleSignIn
              }
              style={loginStyles.primaryButton}
            >
              {isForgotPasswordMode
                ? "Send Reset Link"
                : isSignUpMode
                  ? "Sign Up"
                  : "Login"}
            </button>

            {isForgotPasswordMode && (
              <button
                type="button"
                onClick={() => setIsForgotPasswordMode(false)}
                style={loginStyles.secondaryButtonWithMargin}
              >
                Back to Login
              </button>
            )}
          </>
        )}
      </div>

      {/* Sign up link */}
      {!isResettingPassword && !isForgotPasswordMode && (
        <div style={loginStyles.signUpContainer}>
          {isSignUpMode ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUpMode(false)}
                style={loginStyles.signUpButton}
              >
                Login
              </button>
            </>
          ) : (
            <>
              No account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUpMode(true)}
                style={loginStyles.signUpButton}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
