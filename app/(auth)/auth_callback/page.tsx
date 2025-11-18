"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
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

        if (type === "signup" && accessToken) {
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

          if (data.session) {
            // Successfully authenticated, redirect to account details
            router.push("/account_details");
          } else {
            router.push("/sign_up");
          }
        } else {
          // If no token or not a signup, redirect to sign up
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
