"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserOnboarded } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import { ContentContainer, PageContainer, Title, TitleSection } from "./styles";

export default function ProfilePage() {
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
      </ContentContainer>
    </PageContainer>
  );
}
