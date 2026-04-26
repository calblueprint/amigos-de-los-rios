"use server";

import supabaseAdmin from "@/actions/supabase/admin";

export async function setUserAdminStatus(userId: string, isAdmin: boolean) {
  const { error } = await supabaseAdmin
    .from("Users")
    .update({ is_admin: isAdmin })
    .eq("id", userId);
  if (error) throw error;
}
