import { UUID } from "crypto";

export interface Property {
  id: UUID;
  route_id: UUID;
  planit_geo_reference: string;
  order_to_visit: number;
  street_address: string;
  property_name: string;
}
