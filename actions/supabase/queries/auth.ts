import supabase from "../client";
import { upsertUserProfile } from "./query";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth_callback`,
    },
  });

  if (error) {
    throw error;
  }

  // Create initial user record with onboarded: false
  // This ensures a row exists in Users table even if they don't complete onboarding
  if (data.user) {
    try {
      await upsertUserProfile({
        id: data.user.id,
        email: data.user.email || "",
        name: "",
        affiliation: "",
        phone_number: "",
        onboarded: false,
      });
    } catch (profileError) {
      console.error("Error creating initial user profile:", profileError);
      // Don't throw - user account is created, they can complete profile later
    }
  }

  return data;
}

export async function resetPasswordForEmail(email: string, redirectTo: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
}

export async function updateUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

export async function updateUserProfile(profileData: {
  name: string;
  affiliation: string;
  phone_number: string;
}) {
  // Get the current user's session
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    throw new Error("User not authenticated");
  }

  // Update auth metadata
  const { data, error } = await supabase.auth.updateUser({
    data: {
      name: profileData.name,
      affiliation: profileData.affiliation,
      phone_number: profileData.phone_number,
    },
  });

  if (error) {
    throw error;
  }

  // Insert/update the Users table in the database
  await upsertUserProfile({
    id: user.id,
    email: user.email || "",
    name: profileData.name,
    affiliation: profileData.affiliation,
    phone_number: profileData.phone_number,
    onboarded: true,
  });

  return data;
}
