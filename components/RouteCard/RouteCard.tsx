"use client";

import { useRouter } from "next/navigation";
import { Route } from "@/types/schema"; // your branded UUID schema
import {
  RouteCardContainer,
  RouteDate,
  RouteInfo,
  RouteLabel,
  RouteTitle,
} from "./styles";

interface RouteCardProps {
  route: Route;
  sessionId: string; // needed for dynamic routing
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
        <RouteLabel>{route.route_label}</RouteLabel>
        <RouteDate>
          {new Date(route.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </RouteDate>
      </RouteInfo>
    </RouteCardContainer>
  );
}
