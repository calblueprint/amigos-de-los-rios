"use client";

import { useRouter } from "next/navigation";
import { Route } from "@/types/schema"; // your branded UUID schema
import {
  RouteCardContainer,
  RouteGroup,
  RouteIconBox,
  RouteInfo,
  RouteTitle,
} from "./styles";

interface RouteCardProps {
  route: Route;
  sessionId: string;
}

export default function RouteCard({ route, sessionId }: RouteCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/sessions/${sessionId}/${route.id}`);
  };

  return (
    <RouteCardContainer onClick={handleClick}>
      <RouteInfo>
        <RouteTitle>{route.watering_event_name}</RouteTitle>
        <RouteGroup>Group Size: {route.route_label}</RouteGroup>
      </RouteInfo>

      <RouteIconBox />
    </RouteCardContainer>
  );
}
