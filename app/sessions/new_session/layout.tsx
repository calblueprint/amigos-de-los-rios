"use client";

import { SessionCreationProvider } from "@/app/utils/SessionCreationContext";

export default function NewSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionCreationProvider>{children}</SessionCreationProvider>;
}
