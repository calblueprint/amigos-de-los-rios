import { UUID } from "crypto";
import { VolunteerType } from "./volunteerType";

export type Hydrant = {
  id?: UUID; // optional id bc i dont want to generate an id in the code just in the db
  hydrant_id: number;
  hydrant_address: string | null;
  latitude: number | null;
  longitude: number | null;
  hydrant_type: number | null;
};

export type Property = {
  id?: UUID;
  pid: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  water_onsite: boolean;
  num_trees: number | null;
  nearest_hydrant?: UUID | null;
  prev_watered: string | null;
};
export type RouteStop = {
  id: UUID;
  route_id: UUID;
  property_id: UUID | null;
  hydrant_id: UUID | null;
  order_to_visit: number;
  property_address: string;
  Property?: {
    num_trees: number;
  } | null;
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
  group_leader_id: UUID | null;
  compatible_hydrant_types: string[];
};

export type WateringSession = {
  id: string;
  date: string;
  watering_event_name: string;
  central_hub: string;
  central_hub_address: string;
};

export type User = {
  id: UUID;
  email: string;
  name: string;
  affiliation: string;
  phone_number: string;
  onboarded: boolean;
  is_admin: boolean;
  is_registered: boolean;
};

export type Team = {
  name: string;
  type: string;
  hydrant_type: string[];
  size: number;
  time: number;
};

export type RouteUserAssignment = {
  id: UUID;
  user_id: UUID;
  route_id: UUID;
  published: boolean;
  session_id: UUID;
};
