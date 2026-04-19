"use client";

import Link from "next/link";
import { BannerContainer, Logo } from "./styles";

export default function Banner() {
  return (
    <Link href="/sessions">
      <BannerContainer>
        <Logo src="/amigos-logo.png" alt="Amigos de los Rios logo" />
      </BannerContainer>
    </Link>
  );
}
