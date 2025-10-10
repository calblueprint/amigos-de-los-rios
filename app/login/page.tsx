"use client";

import { useState } from "react";
import supabase from "../../actions/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(`An error occurred trying to reset password: ${error}`);
    }
    console.log("Reset password successful");
  };

  return (
    <>
      <input
        name="email"
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        name="password"
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
  );
}
