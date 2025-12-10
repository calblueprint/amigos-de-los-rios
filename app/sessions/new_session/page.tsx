"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewSessionRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sessions/new_session/basic_info");
  }, [router]);

  return <p>Redirecting...</p>;
}
