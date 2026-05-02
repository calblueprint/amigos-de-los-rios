"use client";

import { RouteStop } from "@/types/schema";
import {
  CardContainer,
  OrderCircle,
  PropertyAddress,
  PropertyInfo,
  PropertyType,
} from "./styles";

interface PropertyCardProps {
  property: RouteStop;
  isHub?: boolean;
}

export default function PropertyCard({ property, isHub }: PropertyCardProps) {
  console.log("FULL ROUTE STOP:", property);
  const isHydrant = property.hydrant_id !== null;
  const numTrees = property.Property?.num_trees ?? 0;

  return (
    <CardContainer>
      <OrderCircle $isHydrant={isHydrant} $isHub={isHub}>
        {property.order_to_visit}
      </OrderCircle>

      <PropertyInfo>
        <PropertyAddress>{property.property_address}</PropertyAddress>
        <PropertyType>
          {isHub
            ? "Central Hub"
            : isHydrant
              ? "Hydrant"
              : `Property | ${numTrees} Trees`}
        </PropertyType>
      </PropertyInfo>
    </CardContainer>
  );
}
