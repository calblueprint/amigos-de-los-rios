"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { IconSvgs } from "@/lib/icons";
import {
  Avatar,
  FooterSection,
  MenuButton,
  NavItemButton,
  NavSection,
  Overlay,
  Panel,
  SidebarHead,
  UserName,
  UserRole,
} from "./styles";

export default function MenuSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { userId, signOut } = useAuth();
  const pathname = usePathname();
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
  }, [userId, isOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    setIsOpen(false);
  };

  return (
    <>
      <MenuButton onClick={() => setIsOpen(true)}>
        {IconSvgs.menu_sidebar_three_lines}
      </MenuButton>

      {isOpen &&
        createPortal(
          <>
            <Overlay onClick={() => setIsOpen(false)} />

            <Panel>
              <SidebarHead>
                <Avatar>{IconSvgs.profile_person_white}</Avatar>
                <div>
                  <UserName>{userName}</UserName>
                  <UserRole>{isAdmin ? "Admin" : "Volunteer"}</UserRole>
                </div>
              </SidebarHead>

              <NavSection>
                <NavItem
                  icon={IconSvgs.home_menu_gray}
                  label="Home"
                  // Active if the URL is exactly "/sessions" (or starts with it, if you want sub-pages highlighted)
                  active={pathname.startsWith("/sessions")}
                  onClick={() => {
                    router.push("/sessions");
                    setIsOpen(false);
                  }}
                />
                <NavItem
                  icon={IconSvgs.personal_details_menu_gray}
                  label="Personal Details"
                  active={pathname === "/profile"}
                  onClick={() => {
                    router.push("/profile");
                    setIsOpen(false);
                  }}
                />
                {isAdmin && (
                  <NavItem
                    icon={IconSvgs.admin_menu_gray}
                    label="Admin Management"
                    active={pathname === "/"}
                    onClick={() => {
                      router.push("/admin_management");
                      setIsOpen(false);
                    }}
                  />
                )}
              </NavSection>

              <FooterSection>
                <NavItem
                  icon={IconSvgs.logout_gray}
                  label="Logout"
                  onClick={handleSignOut}
                />
              </FooterSection>
            </Panel>
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
    <NavItemButton $active={active} onClick={onClick}>
      {icon}
      {label}
    </NavItemButton>
  );
}
