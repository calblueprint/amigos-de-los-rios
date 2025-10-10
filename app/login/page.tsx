"use client";

import { useEffect, useState } from "react";
import supabase from "../../actions/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <>
      {message && (
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            backgroundColor: message.includes("Error") ? "#ffebee" : "#e8f5e8",
            border: `1px solid ${message.includes("Error") ? "#f44336" : "#4caf50"}`,
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      {isResettingPassword ? (
        // Password reset form
        <>
          <h3>Set New Password</h3>
          <input
            type="password"
            placeholder="New Password"
            onChange={e => setNewPassword(e.target.value)}
            value={newPassword}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            onChange={e => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <button type="button" onClick={handleUpdatePassword}>
            Update Password
          </button>
          <button type="button" onClick={() => setIsResettingPassword(false)}>
            Cancel
          </button>
        </>
      ) : (
        // Regular login/signup form
        <>
          <input
            name="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
          <button type="button" onClick={handleSignUp}>
            Sign up
          </button>
          <button type="button" onClick={handleSignIn}>
            Sign in
          </button>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
          <button type="button" onClick={handleResetPassword}>
            Reset password
          </button>
        </>
      )}
    </>
  );
}
