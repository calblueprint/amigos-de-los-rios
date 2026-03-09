"use client";

import { RouteStop } from "@/types/schema";
import {
  CardContainer,
  OrderCircle,
  PropertyAddress,
  PropertyInfo,
  PropertyName,
} from "./styles";

interface PropertyCardProps {
  property: RouteStop;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <CardContainer>
      <OrderCircle>{property.order_to_visit}</OrderCircle>
      <PropertyInfo>
        <PropertyName>{property.id}</PropertyName>
        <PropertyAddress>{property.property_address}</PropertyAddress>
      </PropertyInfo>
    </CardContainer>
  );
}
