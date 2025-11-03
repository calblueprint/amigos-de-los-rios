"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateUserPassword } from "@/actions/supabase/queries/auth";
import greenCheck from "@/assets/images/green-check.svg";
import whiteLogo from "@/assets/images/white_logo.svg";
import * as S from "../styles";

export default function SetNewPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);

  const handleUpdatePassword = async () => {
    // Clear previous errors
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!newPassword) {
      setNewPasswordError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      await updateUserPassword(newPassword);

      setPasswordReset(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setNewPasswordError(errorMessage);
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
              <Image src={greenCheck} alt="Success" width={80} height={80} />
            </S.SuccessIconContainer>

            <S.SuccessHeading>Password reset!</S.SuccessHeading>

            <S.PrimaryButton type="button" onClick={handleGoToLogin}>
              Login
            </S.PrimaryButton>
          </>
        ) : (
          // Password Input View
          <>
            <S.Heading>Set New Password</S.Heading>
            <S.Underline />

            <S.InputGroup>
              <S.Label>
                New Password<S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                type="password"
                placeholder=""
                onChange={e => {
                  setNewPassword(e.target.value);
                  if (newPasswordError) setNewPasswordError("");
                }}
                value={newPassword}
                $hasError={!!newPasswordError}
              />
              {newPasswordError && (
                <S.ErrorText>{newPasswordError}</S.ErrorText>
              )}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>
                Confirm New Password
                <S.RequiredAsterisk>*</S.RequiredAsterisk>
              </S.Label>
              <S.Input
                type="password"
                placeholder=""
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError("");
                }}
                value={confirmPassword}
                $hasError={!!confirmPasswordError}
              />
              {confirmPasswordError && (
                <S.ErrorText>{confirmPasswordError}</S.ErrorText>
              )}
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
