import { UUID } from "crypto";

export interface Property {
  id: UUID;
  route_id: UUID;
  planit_geo_reference: string;
  order_to_visit: number;
  street_address: string;
  property_name: string;
}

export type Route = {
  id: UUID;
  watering_event_id: UUID;
  date: string;
  watering_event_name: string;
  route_label: string;
  volunteer_type: number;
  maps_link: string;
};

export type WateringSession = {
  id: string;
  date: string;
  watering_event_name: string;
  central_hub: string;
};
