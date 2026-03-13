"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserOnboarded } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import {
  CardsContainer,
  ContentContainer,
  PageContainer,
  Title,
  TitleSection,
} from "./styles";

export default function ProfilePage() {
  //Profile fields
  const profileFields = [
    { label: "Full Name", value: "Aiden M" },
    { label: "Email Address", value: "aiden@amigosdelosrios.com" },
    { label: "Affiliation", value: "Los Angeles Community Group" },
    { label: "Phone Number", value: "(123) 456-7890" },
  ];

  //Password fields
  const passwordFields = [{ label: "", value: "********" }];

  const EditProfile = () => {
    // Handle edit profile logic here (e.g., navigate to edit page or open modal)
    console.log("Edit Profile button clicked");
  };

  const ChangePassword = () => {
    // Handle change password logic here (e.g., navigate to change password page or open modal)
    console.log("Change Password button clicked");
  };

  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);

      // Wait for auth to finish loading
      if (authLoading) return;

      if (!userId) {
        router.push("/login");
        return;
      }

      const isOnboarded = await checkUserOnboarded(userId);
      if (!isOnboarded) {
        router.push("/account_details");
        return;
      }

      setLoading(false);
    }

    init();
  }, [userId, authLoading, router]);

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
