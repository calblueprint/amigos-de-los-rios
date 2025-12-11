"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import { checkUserOnboarded } from "@/actions/supabase/queries/users";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (accessToken) {
          // Exchange the access token for a session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get("refresh_token") || "",
          });

          if (error) {
            console.error("Error setting session:", error);
            router.push("/sign_up");
            return;
          }

          if (data.session?.user) {
            // Check if user has completed onboarding
            const isOnboarded = await checkUserOnboarded(data.session.user.id);

            if (type === "recovery") {
              // Password reset flow - redirect to set new password
              router.push("/set_new_password");
            } else if (isOnboarded) {
              // User is already onboarded, redirect to sessions
              router.push("/sessions");
            } else {
              // User hasn't completed onboarding, redirect to account details
              router.push("/account_details");
            }
          } else {
            router.push("/sign_up");
          }
        } else {
          // If no token, redirect to sign up
          router.push("/sign_up");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        router.push("/sign_up");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <S.Container>
      {/* Logo */}
      <S.Logo
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
      />

      {/* Loading Card */}
      <S.Card>
        <S.Heading>Verifying...</S.Heading>
        <S.Underline />
        <S.VerificationText>
          Please wait while we verify your email address.
        </S.VerificationText>
      </S.Card>
    </S.Container>
  );
}
