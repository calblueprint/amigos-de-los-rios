"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconSvgs } from "@/lib/icons";
import {
  CheckboxBox,
  DropdownIcon,
  DropdownMenu,
  DropdownMultiItem,
  DropdownWrapper,
  FakeInput,
  FakeInputText,
} from "./styles";

type DropdownValue = string | number;

interface DropdownMultiProps {
  value: DropdownValue[];
  options: DropdownValue[];
  onChange: (value: DropdownValue[]) => void;
  disabled?: boolean;
}

export default function DropdownMulti({
  value,
  options,
  onChange,
  disabled,
}: DropdownMultiProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

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

  const toggleOption = useCallback(
    (option: DropdownValue) => {
      const isSelected = value.includes(option);
      onChange(
        isSelected ? value.filter(v => v !== option) : [...value, option],
      );
    },
    [value, onChange],
  );

  return (
    <DropdownWrapper ref={wrapperRef}>
      <FakeInput
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        $disabled={disabled}
      >
        <FakeInputText>
          {value.length === 0
            ? "Select..."
            : `(${value.length}) ${value.join(", ")}`}
        </FakeInputText>

        {!disabled && (
          <DropdownIcon $isOpen={isOpen}>
            {React.cloneElement(IconSvgs.dropdown, {
              style: { transition: "transform 0.2s ease" },
            })}
          </DropdownIcon>
        )}
      </FakeInput>

      {isOpen && (
        <DropdownMenu>
          {options.map(option => {
            const isSelected = value.includes(option);
            return (
              <DropdownMultiItem
                key={String(option)}
                onClick={() => toggleOption(option)}
              >
                <CheckboxBox $checked={isSelected}>
                  {isSelected && IconSvgs.checkmark}
                </CheckboxBox>
                {option}
              </DropdownMultiItem>
            );
          })}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
}
