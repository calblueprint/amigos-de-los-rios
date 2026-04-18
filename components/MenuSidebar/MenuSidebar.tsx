"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { IconSvgs } from "@/lib/icons";
import COLORS from "@/styles/colors";

export default function MenuSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { userId, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      if (!userId) return;
      const user = await getUserById(userId);
      if (user) {
        setUserName(`${user.name}`);
        setIsAdmin(user.is_admin ?? false);
      }
    }
    loadUser();
  }, [userId]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 10 }}
        className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-white/10"
      >
        {IconSvgs.menu_sidebar_three_lines}
      </button>

      {isOpen &&
        createPortal(
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 40,
              }}
              onClick={() => setIsOpen(false)}
            />

            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
                width: "420px",
                background: "white",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: COLORS.adlr_blue,
                  padding: "1.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {IconSvgs.profile_person_white}
                </div>
                <div>
                  <div
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {userName}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {isAdmin ? "Admin" : "Volunteer"}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, padding: "1rem" }}>
                <NavItem
                  icon={IconSvgs.home_menu_gray}
                  label="Home"
                  active
                  onClick={() => {
                    router.push("/sessions");
                    setIsOpen(false);
                  }}
                />
                <NavItem
                  icon={IconSvgs.personal_details_menu_gray}
                  label="Personal Details"
                  onClick={() => {
                    router.push("/");
                    setIsOpen(false);
                  }}
                />
                {isAdmin && (
                  <NavItem
                    icon={IconSvgs.admin_menu_gray}
                    label="Admin Management"
                    onClick={() => {
                      router.push("/");
                      setIsOpen(false);
                    }}
                  />
                )}
              </div>

              <div style={{ borderTop: "1px solid #e5e7eb", padding: "1rem" }}>
                <NavItem
                  icon={IconSvgs.logout_gray}
                  label="Logout"
                  onClick={handleSignOut}
                />
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: "none",
        background: active ? "#f3f4f6" : "transparent",
        cursor: "pointer",
        marginBottom: "0.25rem",
        fontSize: "1rem",
        color: "#111",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
