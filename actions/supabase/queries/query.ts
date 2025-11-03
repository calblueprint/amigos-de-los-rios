import supabase from "../client";

// Example query to fetch all rows from your_table_name
export async function fetchAllRows() {
  const { data, error } = await supabase.from("your_table_name").select("*");

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data;
}

// Insert or update user profile data in the Users table
export async function upsertUserProfile(profileData: {
  id: string; // Auth user ID
  email: string;
  name: string;
  affiliation: string;
  phone_number: string;
  onboarded: boolean;
}) {
  const { data, error } = await supabase
    .from("Users")
    .upsert(
      {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        affiliation: profileData.affiliation,
        phone_number: profileData.phone_number,
        onboarded: profileData.onboarded,
      },
      {
        onConflict: "id", // Update if user already exists
      },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Error upserting user profile: ${error.message}`);
  }

  return data;
}
