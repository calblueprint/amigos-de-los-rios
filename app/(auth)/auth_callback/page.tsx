"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import { upsertUserProfile } from "@/actions/supabase/queries/auth";
import {
  checkUserOnboarded,
  getUserById,
} from "@/actions/supabase/queries/users";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        const finishAfterSession = async (
          sessionUserId: string,
          email: string,
          recovery: boolean,
        ) => {
          const existingUser = await getUserById(sessionUserId);
          if (!existingUser) {
            try {
              await upsertUserProfile({
                id: sessionUserId,
                email,
                name: "",
                affiliation: "",
                phone_number: "",
                onboarded: false,
              });
            } catch (profileError) {
              console.error(
                "Error creating user profile in auth callback:",
                profileError,
              );
            }
          }

          if (recovery) {
            router.push("/set_new_password");
            return;
          }

          const isOnboarded = await checkUserOnboarded(sessionUserId);
          if (isOnboarded) {
            router.push("/sessions");
          } else {
            router.push("/account_details");
          }
        };

        if (accessToken) {
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
            const user = data.session.user;
            await finishAfterSession(
              user.id,
              user.email || "",
              type === "recovery",
            );
          } else {
            router.push("/sign_up");
          }
        } else {
          const searchParams = new URLSearchParams(window.location.search);
          const code = searchParams.get("code");
          if (code) {
            const { data, error } =
              await supabase.auth.exchangeCodeForSession(code);

            if (error) {
              console.error("Error exchanging code for session:", error);
              router.push("/sign_up");
              return;
            }

            if (data.session?.user) {
              const user = data.session.user;
              const recoveryFromQuery = searchParams.get("type") === "recovery";
              await finishAfterSession(
                user.id,
                user.email || "",
                recoveryFromQuery,
              );
            } else {
              router.push("/sign_up");
            }
          } else {
            router.push("/sign_up");
          }
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
