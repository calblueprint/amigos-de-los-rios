"use client";

import Link from "next/link";
import { BannerContainer, Logo, Profile } from "./styles";

export default function Banner() {
  return (
    <Link href="/sessions">
      <BannerContainer>
        <Logo src="/amigos-logo.png" alt="Amigos de los Rios logo" />
        <Profile>
          <img src="/icons/userprofile.svg" alt="User Profile" />
        </Profile>
      </BannerContainer>
    </Link>
  );
}
