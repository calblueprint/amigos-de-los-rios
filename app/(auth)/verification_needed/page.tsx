"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function VerificationNeeded() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email, redirect back to sign up
      router.push("/sign_up");
    }
  }, [searchParams, router]);

  const handleUseAnotherAccount = () => {
    router.push("/sign_up");
  };

  const handleResendLink = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        setMessage("Failed to resend verification email. Please try again.");
      } else {
        setMessage("Verification email resent successfully!");
      }
    } catch {
      setMessage("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    router.push("/sign_up");
  };

  return (
    <S.Container>
      {/* Logo */}
      <S.Logo
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
      />

      {/* Verification Card */}
      <S.Card>
        {message && (
          <S.Message $isError={message.includes("Failed")}>{message}</S.Message>
        )}

        <S.Heading>Verification Needed</S.Heading>
        <S.Underline />

        <S.VerificationText>Thanks for signing up!</S.VerificationText>

        <S.VerificationText>
          A verification link has been sent to the email specified, please check
          your inbox.
        </S.VerificationText>

        <S.EmailDisplay>{email}</S.EmailDisplay>

        <S.PrimaryButton type="button" onClick={handleUseAnotherAccount}>
          Use Another Account
        </S.PrimaryButton>

        <S.ResendContainer>
          Didn&apos;t receive it?{" "}
          <S.ResendLink onClick={handleResendLink} disabled={isResending}>
            {isResending ? "Sending..." : "Resend Link"}
          </S.ResendLink>
        </S.ResendContainer>
      </S.Card>

      {/* Go Back link */}
      <S.LinkContainer>
        <S.LinkButton onClick={handleGoBack}>Go Back</S.LinkButton>
      </S.LinkContainer>
    </S.Container>
  );
}
