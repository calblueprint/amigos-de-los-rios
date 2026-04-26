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
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const isHydrant = property.property_id === null;
  const numTrees = property.Property?.num_trees ?? 0;

  return (
    <CardContainer>
      <OrderCircle $isHydrant={isHydrant}>
        {property.order_to_visit}
      </OrderCircle>

      <PropertyInfo>
        <PropertyAddress>{property.property_address}</PropertyAddress>
        <PropertyType>
          {isHydrant ? "Hydrants" : `Property | ${numTrees} Trees`}
        </PropertyType>
      </PropertyInfo>
    </CardContainer>
  );
}
