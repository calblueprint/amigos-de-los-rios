import { UUID } from "crypto";
import { VolunteerType } from "./volunteerType";

export type Property = {
  id: UUID;
  route_id: UUID;
  planit_geo_reference: string | null;
  order_to_visit: number;
  street_address: string;
  property_name: string;
};

export type Route = {
  id: UUID;
  watering_event_id: UUID;
  date: string;
  watering_event_name: string;
  route_label: string;
  volunteer_type: VolunteerType;
  maps_link: string | null;
  num_volunteers: number;
};

export type WateringSession = {
  id: string;
  date: string;
  watering_event_name: string;
  central_hub: string;
};

export type User = {
  id: UUID;
  email: string;
  name: string;
  affiliation: string;
  phone_number: string;
  onboarded: boolean;
  is_admin: boolean;
};

export type Team = {
  type: string;
  size: number;
  time: string;
};

export type RouteUserAssignment = {
  id: UUID;
  user_id: UUID;
  route_id: UUID;
  published: boolean;
  session_id: UUID;
};
