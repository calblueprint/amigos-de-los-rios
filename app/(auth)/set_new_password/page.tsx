"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateUserPassword } from "@/actions/supabase/queries/auth";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function SetNewPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields");
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setIsError(true);
      return;
    }

    try {
      await updateUserPassword(newPassword);

      setPasswordReset(true);
      setIsError(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessage(`Error: ${errorMessage}`);
      setIsError(true);
      return;
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
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

      {/* Set New Password Card */}
      <S.Card>
        {passwordReset ? (
          // Success View
          <>
            <S.SuccessIconContainer>
              <S.CheckCircle>
                <S.Checkmark>✓</S.Checkmark>
              </S.CheckCircle>
            </S.SuccessIconContainer>

            <S.SuccessHeading>Password reset!</S.SuccessHeading>

            <S.PrimaryButton type="button" onClick={handleGoToLogin}>
              Login
            </S.PrimaryButton>
          </>
        ) : (
          // Password Input View
          <>
            {message && <S.Message $isError={isError}>{message}</S.Message>}

            <S.Heading>Set New Password</S.Heading>
            <S.Underline />

            <S.InputGroup>
              <S.Label>
                New Password<S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                type="password"
                placeholder=""
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>
                Confirm New Password
                <S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                type="password"
                placeholder=""
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </S.InputGroup>

            <S.PrimaryButton
              type="button"
              onClick={handleUpdatePassword}
              $marginBottom
            >
              Update Password
            </S.PrimaryButton>
            <Link href="/login">
              <S.SecondaryButton type="button">Cancel</S.SecondaryButton>
            </Link>
          </>
        )}
      </S.Card>
    </S.Container>
  );
}
