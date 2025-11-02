"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function AccountDetails() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleContinue = async () => {
    // Client-side validation
    if (!name || !affiliation || !phoneNumber) {
      setMessage("Please fill in all required fields");
      setIsError(true);
      return;
    }

    // Basic phone number validation (can be adjusted based on requirements)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      setMessage("Please enter a valid phone number");
      setIsError(true);
      return;
    }

    try {
      await updateUserProfile({
        name,
        affiliation,
        phone_number: phoneNumber,
      });

      setMessage("Profile updated successfully!");
      setIsError(false);

      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push("/account_success");
      }, 1500);
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  const handleGoBack = () => {
    router.back();
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

      {/* Account Details Card */}
      <S.Card>
        {message && <S.Message $isError={isError}>{message}</S.Message>}

        <S.Heading>Account Details</S.Heading>
        <S.Underline />

        <S.InputGroup>
          <S.Label>
            Name<S.RequiredAsterisk>*</S.RequiredAsterisk>
          </S.Label>
          <S.Input
            name="name"
            type="text"
            placeholder=""
            onChange={e => setName(e.target.value)}
            value={name}
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>
            Affiliation<S.RequiredAsterisk>*</S.RequiredAsterisk>
          </S.Label>
          <S.Input
            name="affiliation"
            type="text"
            placeholder=""
            onChange={e => setAffiliation(e.target.value)}
            value={affiliation}
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>
            Phone Number<S.RequiredAsterisk>*</S.RequiredAsterisk>
          </S.Label>
          <S.Input
            name="phoneNumber"
            type="tel"
            placeholder=""
            onChange={e => setPhoneNumber(e.target.value)}
            value={phoneNumber}
          />
        </S.InputGroup>

        <S.PrimaryButton type="button" onClick={handleContinue}>
          Continue
        </S.PrimaryButton>
      </S.Card>

      {/* Go Back link */}
      <S.LinkContainer>
        <S.LinkButton onClick={handleGoBack}>Go Back</S.LinkButton>
      </S.LinkContainer>
    </S.Container>
  );
}
