"use client";

import { useState, useEffect } from "react";
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
    if (urlParams.get('reset') === 'true') {
      setIsResettingPassword(true);
      setMessage("Please enter your new password below");
    }
  }, []);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`An error occurred trying to sign up: ${error}`);
    }

    return data;
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`An error occurred trying to sign in: ${error}`);
    }

    return data;
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`An error occurred trying to sign out: ${error}`);
    }
    console.log("Sign out successful");
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }
    
    setMessage("Password reset email sent! Check your inbox and click the link.");
    console.log("Reset password email sent");
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

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
    console.log("Password updated successfully");
  };

  return (
    <>
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${message.includes('Error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px'
        }}>
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
