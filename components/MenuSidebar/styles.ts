"use client";

import styled from "styled-components";
import COLORS from "@/styles/colors";

export const MenuButton = styled.div`
  background: transparent;
  position: absolute;
  top: 3.75rem;
  left: 3.125rem;
  z-index: 10;
  border-radius: 50%;
  width: 3.75rem;
  height: 3.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
  cursor: pointer;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 110;
`;

export const Panel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 17.5rem;
  background: ${COLORS.adlr_white};
  z-index: 120;
  display: flex;
  flex-direction: column;
`;

export const SidebarHead = styled.div`
  background: ${COLORS.adlr_blue};
  padding: 3.875rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

export const Avatar = styled.div`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
`;

export const UserName = styled.div`
  color: white;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  color: #fff;
`;

export const UserRole = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.3125rem;
  letter-spacing: -0.01313rem;
`;

export const NavSection = styled.div`
  flex: 1;
  padding: 1em;
`;

export const FooterSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

export const NavItemButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ $active }) => ($active ? "#f3f4f6" : "transparent")};
  cursor: pointer;
  margin-bottom: 0.25rem;
  text-align: center;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.01688rem;

  color: ${COLORS.adlr_black};

  svg {
    display: block;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active }) => ($active ? "#e5e7eb" : "#f9fafb")};
  }
`;
