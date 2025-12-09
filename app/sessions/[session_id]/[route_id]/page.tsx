"use client";

import { use, useEffect, useState } from "react";
import { fetchPropertiesByRouteId } from "@/actions/supabase/queries/routes";
import {
  assignUserToRoute,
  getAssignedUsersByRouteId,
  unassignUserFromRoute,
} from "@/actions/supabase/queries/routeUserAssignments";
import { getUserByEmail, getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import Banner from "@/components/Banner/Banner";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { Property, User } from "@/types/schema";
import {
  BackLink,
  ContentContainer,
  Header,
  PageContainer,
  PropertiesList,
  Tab,
  TabContainer,
} from "./styles";

export default function RoutePage({
  params,
}: {
  params: Promise<{ session_id: string; route_id: string }>;
}) {
  const { session_id, route_id } = use(params);
  const { userId } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        // Load user role
        if (userId) {
          const userRow = await getUserById(userId);
          setIsAdmin(userRow?.is_admin ?? false);
        }

        // Load properties
        const props = await fetchPropertiesByRouteId(route_id);
        setProperties(props);

        const assigned = await getAssignedUsersByRouteId(route_id);
        setAssignedUsers(assigned);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load route data",
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [session_id, route_id, userId]);

  async function handleAssign() {
    try {
      if (!emailInput) return;

      setAssignLoading(true);

      const user = await getUserByEmail(emailInput);

      const alreadyAssigned = assignedUsers.some(item => item.id === user.id);

      if (alreadyAssigned) {
        setEmailInput("");
        return;
      }

      await assignUserToRoute(route_id, user.id, session_id);

      const updated = await getAssignedUsersByRouteId(route_id);
      setAssignedUsers(updated);
      setEmailInput("");
    } catch (err) {
      alert("Failed to assign user.");
    } finally {
      setAssignLoading(false);
    }
  }

  async function handleUnassign(userId: string) {
    try {
      await unassignUserFromRoute(route_id, userId);
      const updated = await getAssignedUsersByRouteId(route_id);
      setAssignedUsers(updated);
    } catch (err) {
      alert("Failed to unassign user.");
    }
  }

  if (loading) return <p>Loading route...</p>;
  if (error) return <p>Error: {error}</p>;

  const backLink = isAdmin ? `/sessions/${session_id}` : "/sessions";

  return (
    <PageContainer>
      <Banner />

      <BackLink href={backLink}>← Back to Sessions</BackLink>

      <ContentContainer>
        <Header>Central Hub Name</Header>

        <TabContainer>
          <Tab $active>Properties</Tab>
          <Tab>Route</Tab>
          <Tab>Group</Tab>
        </TabContainer>

        {/* temporary input styling */}
        {isAdmin && (
          <div style={{ marginBottom: "2rem" }}>
            <h3>Assign User to Route</h3>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Enter user email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                style={{ padding: "0.5rem", width: "250px" }}
              />

              <button onClick={handleAssign} disabled={assignLoading}>
                {assignLoading ? "Assigning..." : "Assign"}
              </button>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4>Assigned Users</h4>

              {assignedUsers.length === 0 ? (
                <p>No users assigned.</p>
              ) : (
                assignedUsers.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                    }}
                  >
                    <div>
                      <strong>{item.name}</strong> — {item.email}
                    </div>

                    <button onClick={() => handleUnassign(item.id)}>
                      Unassign
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <PropertiesList>
          {properties.length === 0 ? (
            <p>No properties found for your route.</p>
          ) : (
            properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </PropertiesList>
      </ContentContainer>
    </PageContainer>
  );
}
