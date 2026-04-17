"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import ProfileCard from "@/components/ProfileCard";
import {
  CardsContainer,
  ContentContainer,
  PageContainer,
  Title,
  TitleSection,
} from "./styles";

export default function ProfilePage() {
  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    affiliation: string;
    phone_number: string;
  } | null>(null);

  //Password fields
  const passwordFields = [{ label: "", value: "********" }];

  // Handle edit profile logic here
  const EditProfile = () => {
    console.log("Edit Profile button clicked");
  };

  const ChangePassword = () => {
    router.push("/reset_password");
  };

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
    { label: "Name", value: profile?.name || "" },
    { label: "Email", value: profile?.email || "" },
    { label: "Affiliation", value: profile?.affiliation || "" },
    { label: "Phone Number", value: profile?.phone_number || "" },
  ];

  if (loading || authLoading) return <p>Loading profile...</p>;

  return (
    <PageContainer>
      <Banner />
      <ContentContainer>
        <TitleSection>
          <Title>Personal Details</Title>
        </TitleSection>

        <CardsContainer>
          <ProfileCard
            title="Profile Information"
            fields={profileFields}
            buttonText="Edit Profile"
            onButtonClick={EditProfile}
          />

          <ProfileCard
            title="Password"
            fields={passwordFields}
            buttonText="Change Password"
            onButtonClick={ChangePassword}
          />
        </CardsContainer>
      </ContentContainer>
    </PageContainer>
  );
}
