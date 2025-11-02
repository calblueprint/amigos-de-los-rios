import supabase from "../client";

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

  return data;
}
