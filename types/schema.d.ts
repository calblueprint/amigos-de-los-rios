import { UUID } from "crypto";
import { VolunteerType } from "./volunteerType";

export type Hydrant = {
  id?: UUID; // optional id bc i dont want to generate an id in the code just in the db
  hydrant_id: number;
  hydrant_address: string | null;
  latitude: number | null;
  longitude: number | null;
  hydrant_type: string | null;
};

export type Property = {
  id?: UUID;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  water_onsite: boolean;
  num_trees: string | null;
  nearest_hydrant: UUID;
  prev_watered: boolean;
};
export type RouteStop = {
  id: UUID;
  route_id: UUID;
  property_id: UUID;
  order_to_visit: number;
  property_address: string;
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
