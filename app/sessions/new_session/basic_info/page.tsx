"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import { useSessionCreation } from "@/app/utils/SessionCreationContext";
import Banner from "@/components/Banner/Banner";
import {
  BackLink,
  ContentContainer,
  FixedBottomContainer,
  GenerateButton,
  Input,
  Label,
  PageContainer,
  Title,
} from "../styles";

export default function BasicInfoPage() {
  const { data, updateBasicInfo } = useSessionCreation();
  const [sessionName, setSessionName] = useState(data.sessionName);
  const [centralHub, setCentralHub] = useState(data.centralHub);
  const [date, setDate] = useState(data.date);
  const [address, setAddress] = useState(data.address);
  const [description, setDescription] = useState(data.description);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  //check if all fields are filled before allowing user to proceed
  const isFormValid =
    sessionName.trim() !== "" &&
    centralHub.trim() !== "" &&
    date !== "" &&
    address.trim() !== "";

  // Sync local state with context when context changes (e.g., when navigating back)
  useEffect(() => {
    setSessionName(data.sessionName);
    setCentralHub(data.centralHub);
    setDate(data.date);
    setAddress(data.address);
    setDescription(data.description);
  }, [
    data.sessionName,
    data.centralHub,
    data.date,
    data.address,
    data.description,
  ]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        if (!userId) return;

        const userRow = await getUserById(userId);
        const adminStatus = userRow?.is_admin ?? false;
        setIsAdmin(adminStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [userId, isAdmin]);

  const handleNext = () => {
    // Validate required fields
    if (!sessionName.trim() || !centralHub.trim() || !date || !address.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Update context with basic info
    updateBasicInfo(sessionName, centralHub, date, address, description);

    // Navigate to teams page
    router.push("/sessions/new_session/teams");
  };

  if (loading) return <p>Loading page...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!isAdmin) {
    return (
      <PageContainer style={{ padding: "40px", textAlign: "center" }}>
        <h2>401 unauthorized</h2>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Banner />
      <BackLink href="/sessions">← Back to Sessions</BackLink>

      <ContentContainer>
        <Title>Create Session</Title>

        <Label>
          Session Name<span className="required">*</span>
        </Label>
        <Input
          placeholder="Enter session name here"
          value={sessionName}
          onChange={e => setSessionName(e.target.value)}
        />

        <Label>
          Central Hub<span className="required">*</span>
        </Label>
        <Input
          placeholder="Enter central hub name"
          value={centralHub}
          onChange={e => setCentralHub(e.target.value)}
        />

        <Label>
          Date<span className="required">*</span>
        </Label>
        <Input
          type="date"
          placeholder="MM/DD/YYYY"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <Label>
          Address<span className="required">*</span>
        </Label>
        <Input
          placeholder="Enter address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <Label>Description</Label>
        <Input
          as="textarea"
          rows={4}
          placeholder="Enter a short description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ resize: "vertical" }}
        />
      </ContentContainer>
      <FixedBottomContainer>
        <ContentContainer>
          <GenerateButton onClick={handleNext} disabled={!isFormValid}>
            Continue
          </GenerateButton>
        </ContentContainer>
      </FixedBottomContainer>
    </PageContainer>
  );
}
