"use client";

import { Property } from "@/types/schema";
import {
  CardContainer,
  OrderCircle,
  PropertyAddress,
  PropertyInfo,
  PropertyName,
} from "./styles";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <CardContainer>
      <OrderCircle>{property.order_to_visit}</OrderCircle>
      <PropertyInfo>
        <PropertyName>{property.property_name}</PropertyName>
        <PropertyAddress>{property.street_address}</PropertyAddress>
      </PropertyInfo>
    </CardContainer>
  );
}
