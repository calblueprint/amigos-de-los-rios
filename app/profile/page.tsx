"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  checkUserOnboarded,
  getUserById,
  updateUserProfile,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import MenuSidebar from "@/components/MenuSidebar/MenuSidebar";
import ProfileCard from "@/components/ProfileCard";
import { IconSvgs } from "@/lib/icons";
import {
  CardsContainer,
  ContentContainer,
  PageContainer,
  PasswordPanel,
  PasswordPanelHelper,
  PasswordPanelRow,
  PasswordPanelTitle,
  PasswordResetButton,
  Title,
  TitleSection,
} from "./styles";

export default function ProfilePage() {
  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [passwordResetSigningOut, setPasswordResetSigningOut] = useState(false);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    affiliation: string;
    phone_number: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    async function init() {
      setLoading(true);

      const isOnboarded = await checkUserOnboarded(userId!);
      if (!isOnboarded) {
        router.push("/account_details");
        return;
      }

      const userProfile = await getUserById(userId!);
      if (userProfile) {
        setProfile(userProfile);
      }
      setLoading(false);
    }

    init();
  }, [userId, authLoading, router]);

  const profileFields = [
    { key: "name", label: "Full Name", value: profile?.name || "" },
    {
      key: "email",
      label: "Email Address",
      value: profile?.email || "",
      validate: (v: string) => {
        if (v.length > 254) return "Email must be 254 characters or fewer.";
        if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v))
          return "Enter a valid email address.";
        return null;
      },
    },
    {
      key: "affiliation",
      label: "Affiliation",
      value: profile?.affiliation || "",
    },
    {
      key: "phone_number",
      label: "Phone Number",
      value: profile?.phone_number || "",
      validate: (v: string) => {
        if (v.length > 15) return "Phone number must be 15 digits or fewer.";
        if (!/^[\d\s\-().]+$/.test(v)) return "Enter a valid phone number.";
        return null;
      },
    },
  ];

  const handleSaveProfile = async (updatedFields: Record<string, string>) => {
    await updateUserProfile(userId!, updatedFields);
    setProfile(prev => (prev ? { ...prev, ...updatedFields } : prev));
  };

  const handlePasswordResetClick = async () => {
    setPasswordResetSigningOut(true);
    try {
      await supabase.auth.signOut({ scope: "global" });
      window.location.assign(`${window.location.origin}/reset_password`);
    } catch {
      setPasswordResetSigningOut(false);
    }
  };

  if (loading || authLoading) return <p>Loading profile...</p>;

  return (
    <PageContainer>
      <Banner />
      <MenuSidebar />
      <ContentContainer>
        <TitleSection>
          <Title>Personal Details</Title>
        </TitleSection>

        <CardsContainer>
          <ProfileCard
            title="Profile Information"
            fields={profileFields}
            onSave={handleSaveProfile}
          />
          <PasswordPanel>
            <PasswordPanelTitle>Password</PasswordPanelTitle>
            <PasswordPanelRow>
              <PasswordPanelHelper>
                Click to receive a password reset link via email
              </PasswordPanelHelper>
              <PasswordResetButton
                type="button"
                disabled={passwordResetSigningOut}
                onClick={handlePasswordResetClick}
              >
                {React.cloneElement(IconSvgs.reset_password_send, {
                  width: 18,
                  height: 18,
                  "aria-hidden": true,
                })}
                {passwordResetSigningOut ? "Signing out…" : "Reset Password"}
              </PasswordResetButton>
            </PasswordPanelRow>
          </PasswordPanel>
        </CardsContainer>
      </ContentContainer>
    </PageContainer>
  );
}
