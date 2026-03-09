"use client";

import { useRouter } from "next/navigation";
import { IconSvgs } from "@/lib/icons";
import { Route } from "@/types/schema"; // your branded UUID schema
import { VolunteerType } from "@/types/volunteerType";
import {
  CloseIconButton,
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

  type VolunteerImageRecord = {
    ImageURL: string;
  };

  const ImageRecord: Record<VolunteerType, VolunteerImageRecord> = {
    "Type A": {
      ImageURL: "/images/A_tree.png",
    },
    "Type B": {
      ImageURL: "/images/B_water.png",
    },
    "Type C": {
      ImageURL: "/images/C_truck.png",
    },
    "Type D": {
      ImageURL: "/images/D_truck.png",
    },
    "Type E": {
      ImageURL: "/orange.jpg",
    },
  };

  const img_src = ImageRecord[route.volunteer_type].ImageURL ?? "/orange.jpg";

  return (
    <RouteCardContainer onClick={handleClick}>
      <RouteInfo>
        <CloseIconButton>{IconSvgs.close}</CloseIconButton>
        <RouteTitle>{route.route_label}</RouteTitle>
        <RouteGroup>Group Size: {route.num_volunteers}</RouteGroup>
      </RouteInfo>

      <RouteIconBox src={img_src} alt="Route" />
    </RouteCardContainer>
  );
}
