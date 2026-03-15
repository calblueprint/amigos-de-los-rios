"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
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
  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userAffiliation, setUserAffiliation] = useState();
  const [userPhoneNumber, setUserPhoneNumber] = useState();

  //Password fields
  const passwordFields = [{ label: "", value: "********" }];

  // Handle edit profile logic here
  const EditProfile = () => {
    console.log("Edit Profile button clicked");
  };

  const ChangePassword = () => {
    // Handle change password logic here
    console.log("Change Password button clicked");
  };

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

      const userProfile = await getUserById(userId);
      if (userProfile) {
        setUserName(userProfile.name);
        setUserEmail(userProfile.email);
        setUserAffiliation(userProfile.affiliation);
        setUserPhoneNumber(userProfile.phone_number);
      }
      setLoading(false);
    }

    init();
  }, [userId, authLoading, router]);
  const profileFields = [
    { label: "Name", value: userName || "" },
    { label: "Email", value: userEmail || "" },
    { label: "Affiliation", value: userAffiliation || "" },
    { label: "Phone Number", value: userPhoneNumber || "" },
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
