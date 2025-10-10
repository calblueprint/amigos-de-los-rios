'use client';

import { useState } from 'react';
import supabase from '../../actions/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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

  const signInWithEmail = async () => {
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
    const {error} = await supabase.auth.signOut();

    if (error) {
      throw new Error(`An error occurred trying to sign out: ${error}`);
    }
    console.log('Sign out successful');
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
      <button type="button" onClick={signInWithEmail}>
        Sign in
      </button>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </>
  );
}
