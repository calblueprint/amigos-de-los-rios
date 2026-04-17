"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [isAddressValid, setIsAddressValid] = useState(data.address.trim() !== "");
  const [description, setDescription] = useState(data.description);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placesApiError, setPlacesApiError] = useState<string | null>(null);
  const { userId }: { userId?: string | null } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const addressAutocompleteContainerRef = useRef<HTMLDivElement | null>(null);
  const addressAutocompleteRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const router = useRouter();

  //check if all fields are filled before allowing user to proceed
  const isFormValid =
    sessionName.trim() !== "" &&
    centralHub.trim() !== "" &&
    date !== "" &&
    address.trim() !== "" &&
    isAddressValid;

  // Sync local state with context when context changes (e.g., when navigating back)
  useEffect(() => {
    setSessionName(data.sessionName);
    setCentralHub(data.centralHub);
    setDate(data.date);
    setAddress(data.address);
    setIsAddressValid(data.address.trim() !== "");
    setDescription(data.description);
  }, [data.sessionName, data.centralHub, data.date, data.address, data.description]);

  useEffect(() => {
    if (loading || !isAdmin || !addressAutocompleteContainerRef.current) return;

    const apiKey =
      process.env.NEXT_PUBLIC_PLACES_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY;
    if (!apiKey) {
      setPlacesApiError(
        "Google Places is unavailable. Set NEXT_PUBLIC_PLACES_API_KEY.",
      );
      return;
    }

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const initAutocomplete = async (attempt = 0) => {
      const googleMaps = (window as any).google?.maps;
      if (!googleMaps?.importLibrary || !addressAutocompleteContainerRef.current) {
        if (attempt < 10) {
          retryTimer = setTimeout(() => initAutocomplete(attempt + 1), 200);
          return;
        }
        setPlacesApiError(
          "Google Places failed to initialize. Check API key restrictions and that Places API is enabled.",
        );
        return;
      }

      const placesLibrary = await googleMaps.importLibrary("places");
      const PlaceAutocompleteElement = placesLibrary.PlaceAutocompleteElement;
      if (!PlaceAutocompleteElement) {
        setPlacesApiError(
          "PlaceAutocompleteElement is unavailable. Ensure Places API (New) is enabled.",
        );
        return;
      }

      if (addressAutocompleteRef.current) {
        return;
      }

      const autocomplete = new PlaceAutocompleteElement();
      autocomplete.style.width = "100%";
      autocomplete.setAttribute("id", "address-autocomplete");
      if (address.trim() !== "") {
        autocomplete.value = address;
      }
      addressAutocompleteContainerRef.current.innerHTML = "";
      addressAutocompleteContainerRef.current.appendChild(autocomplete);

      autocompleteRef.current = autocomplete;
      addressAutocompleteRef.current = autocomplete;
      setPlacesApiError(null);

      autocomplete.addEventListener("input", () => {
        setIsAddressValid(false);
      });

      autocomplete.addEventListener("gmp-select", async (event: any) => {
        const placePrediction = event?.placePrediction;
        if (!placePrediction) {
          setIsAddressValid(false);
          setPlacesApiError("Please select a valid address from the suggestions.");
          return;
        }

        const place = placePrediction.toPlace();
        await place.fetchFields({
          fields: ["formattedAddress", "location"],
        });

        const formattedAddress = place?.formattedAddress?.trim();
        const hasGeometry = Boolean(place?.location);
        if (formattedAddress && hasGeometry) {
          setAddress(formattedAddress);
          setIsAddressValid(true);
          setPlacesApiError(null);
          return;
        }

        setIsAddressValid(false);
        setPlacesApiError("Please select a valid address from the suggestions.");
      });
      setPlacesApiError(null);
    };

    const handleScriptLoad = () => initAutocomplete();
    const authFailureHandler = () => {
      setPlacesApiError(
        "Google Maps auth failed. Check API key, allowed referrers, and billing.",
      );
    };
    (window as any).gm_authFailure = authFailureHandler;

    if ((window as any).google?.maps?.importLibrary) {
      initAutocomplete();
      return () => {
        if (retryTimer) clearTimeout(retryTimer);
        delete (window as any).gm_authFailure;
        const googleMaps = (window as any).google?.maps;
        if (autocompleteRef.current && googleMaps?.event) {
          googleMaps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }

    const existingScript = document.getElementById(
      "google-places-autocomplete-script",
    ) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", handleScriptLoad);
      initAutocomplete();
      return () => {
        existingScript.removeEventListener("load", handleScriptLoad);
        if (retryTimer) clearTimeout(retryTimer);
        delete (window as any).gm_authFailure;
        const googleMaps = (window as any).google?.maps;
        if (autocompleteRef.current && googleMaps?.event) {
          googleMaps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }

    const script = document.createElement("script");
    script.id = "google-places-autocomplete-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleScriptLoad);
    script.addEventListener("error", () =>
      setPlacesApiError(
        "Failed to load Google Places script. Verify network and API key restrictions.",
      ),
    );
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
      if (retryTimer) clearTimeout(retryTimer);
      delete (window as any).gm_authFailure;
      const googleMaps = (window as any).google?.maps;
      if (autocompleteRef.current && googleMaps?.event) {
        googleMaps.event.clearInstanceListeners(autocompleteRef.current);
      }
      if (addressAutocompleteContainerRef.current) {
        addressAutocompleteContainerRef.current.innerHTML = "";
      }
      addressAutocompleteRef.current = null;
    };
  }, [loading, isAdmin]);

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
    if (!isAddressValid) {
      alert("Please select a valid address from suggestions.");
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
        <div ref={addressAutocompleteContainerRef} />
        {placesApiError && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{placesApiError}</p>
        )}

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
