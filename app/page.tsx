"use client";

import { CSSProperties, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(auth)/AuthContext";
import BPLogo from "@/assets/images/bp-logo.png";

export default function Home() {
  const { userId, userEmail, loading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !userId) {
      router.push("/auth/login");
    }
  }, [userId, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main style={mainStyles}>
        <p>Loading...</p>
      </main>
    );
  }

  // Don't render anything while redirecting
  if (!userId) {
    return null;
  }

  // Show content only if authenticated
  return (
    <main style={mainStyles}>
      <Image style={imageStyles} src={BPLogo} alt="Blueprint Logo" />
      <h1>Welcome to Amigos de los Rios!</h1>
      <p style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        You are logged in as: <strong>{userEmail}</strong>
      </p>
      <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "2rem" }}>
        User ID: {userId}
      </p>
      <button
        onClick={async () => {
          await signOut();
          router.push("/auth/login");
        }}
        style={signOutButtonStyle}
      >
        Sign Out
      </button>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        Open up app/page.tsx to get started!
      </p>
    </main>
  );
}

// CSS styles

const mainStyles: CSSProperties = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyles: CSSProperties = {
  width: "80px",
  height: "80px",
  marginBottom: "0.5rem",
};

const signOutButtonStyle: CSSProperties = {
  backgroundColor: "#22354D",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  fontFamily: "DM Sans, sans-serif",
  transition: "background-color 0.3s ease",
};
