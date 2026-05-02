"use client";

import React, { useState } from "react";
import supabase from "@/actions/supabase/client";
import { IconSvgs } from "@/lib/icons";
import {
  PasswordPanel,
  PasswordPanelHelper,
  PasswordPanelRow,
  PasswordPanelTitle,
  PasswordResetButton,
} from "./PasswordResetPanel.styles";

export default function PasswordResetPanel() {
  const [signingOut, setSigningOut] = useState(false);

  const handleResetPassword = async () => {
    setSigningOut(true);
    try {
      // Clear stored session (and refresh token) so the recovery email link is not
      // competing with an active session. Full-page navigation avoids a race where the
      // profile page redirects to /login as soon as userId becomes null.
      await supabase.auth.signOut({ scope: "global" });
      window.location.assign(`${window.location.origin}/reset_password`);
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <PasswordPanel>
      <PasswordPanelTitle>Password</PasswordPanelTitle>
      <PasswordPanelRow>
        <PasswordPanelHelper>
          Click to receive a password reset link via email
        </PasswordPanelHelper>
        <PasswordResetButton
          type="button"
          disabled={signingOut}
          onClick={handleResetPassword}
        >
          {React.cloneElement(IconSvgs.reset_password_send, {
            width: 18,
            height: 18,
            "aria-hidden": true,
          })}
          {signingOut ? "Signing out…" : "Reset Password"}
        </PasswordResetButton>
      </PasswordPanelRow>
    </PasswordPanel>
  );
}
