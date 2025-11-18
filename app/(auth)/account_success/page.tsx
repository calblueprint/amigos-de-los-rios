"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import whiteLogo from "@/assets/images/white_logo.svg";
import COLORS from "@/styles/colors";
import * as S from "../styles";

export default function AccountSuccess() {
  const router = useRouter();

  const handleViewSessions = () => {
    router.push("/sessions");
  };

  return (
    <S.Container>
      {/* Logo */}
      <S.Logo
        src={whiteLogo}
        alt="Amigos de los Rios"
        width={300}
        height={100}
      />

      {/* Success Card */}
      <S.Card>
        <div>
          {/* Success Icon */}
          <SuccessIconContainer>
            <SuccessIcon>
              <svg
                width="161"
                height="161"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30" cy="30" r="30" fill={COLORS.adlr_green} />
                <path
                  d="M17 30L26 39L43 22"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SuccessIcon>
          </SuccessIconContainer>

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <S.Heading>Account created!</S.Heading>
          </div>
        </div>

        <S.PrimaryButton
          type="button"
          onClick={handleViewSessions}
          $marginBottom={3}
        >
          View Sessions
        </S.PrimaryButton>
      </S.Card>
    </S.Container>
  );
}

// Styled Components
const SuccessIconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
