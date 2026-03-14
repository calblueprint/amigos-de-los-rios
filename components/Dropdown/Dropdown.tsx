"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconSvgs } from "@/lib/icons";
import {
  DropdownIcon,
  DropdownItem,
  DropdownMenu,
  DropdownWrapper,
  FakeInput,
} from "./styles";

type DropdownValue = string | number;

interface DropdownProps {
  value: DropdownValue;
  options: DropdownValue[];
  onChange: (value: DropdownValue) => void;
}

export default function Dropdown({ value, options, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close even when clicking outside the dropdown - fix from previous version
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  return (
    <DropdownWrapper ref={wrapperRef}>
      <FakeInput onClick={toggleDropdown}>
        <span>{value}</span>

        <DropdownIcon $isOpen={isOpen}>
          {React.cloneElement(IconSvgs.dropdown, {
            style: { transition: "transform 0.2s ease" },
          })}
        </DropdownIcon>
      </FakeInput>

      {isOpen && (
        <DropdownMenu>
          {options.map(option => (
            <DropdownItem
              key={String(option)}
              onClick={() => {
                onChange(option);
                closeDropdown();
              }}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
}
