"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminUsers,
  getUserByEmail,
  getUserById,
} from "@/actions/supabase/queries/users";
import { setUserAdminStatus } from "@/actions/supabase/mutations/users";
import { useAuth } from "@/app/utils/AuthContext";
import AdminCard from "@/components/AdminCard/Admin";
import Banner from "@/components/Banner/Banner";
import { IconSvgs } from "@/lib/icons";
import {
  AddAdminButton,
  AdminCountBadge,
  CancelButton,
  CardsContainer,
  ContentContainer,
  Description,
  ErrorMessage,
  FormActions,
  FormContainer,
  FormField,
  FormInput,
  FormLabel,
  GrantButton,
  PageContainer,
  SectionCard,
  SectionHeader,
  SectionTitle,
  Title,
  TitleSection,
} from "./styles";

export default function AdminPage() {
  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [admins, setAdmins] = useState<
    {
      id: string;
      name: string;
      email: string;
      affiliation: string;
    }[]
  >([]);

  useEffect(() => {
    async function init() {
      try {
        if (authLoading) return;

        if (!userId) {
          router.push("/login");
          return;
        }

        const userRow = await getUserById(userId);
        const adminStatus = userRow?.is_admin ?? false;
        setIsAdmin(adminStatus);

        if (!adminStatus) return;

        const adminUsers = await getAdminUsers();
        setAdmins(adminUsers ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [userId, authLoading, router]);
  async function handleGrantAdmin() {
    setFormError("");
    if (!newEmail.trim()) {
      setFormError("Email address is required.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await getUserByEmail(newEmail.trim());
      if (!user) {
        setFormError("No user found with that email address.");
        return;
      }
      if (user.is_admin) {
        setFormError("This user is already an admin.");
        return;
      }
      await setUserAdminStatus(user.id, true);
      const updated = await getAdminUsers();
      setAdmins(updated ?? []);
      setIsAdding(false);
      setNewEmail("");
      setNewName("");
    } catch {
      setFormError("Failed to grant admin access. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAdmin(adminId: string) {
    try {
      await setUserAdminStatus(adminId, false);
      setAdmins(prev => prev.filter(a => a.id !== adminId));
      if (adminId === userId) {
        router.push("/");
      }
    } catch {
      console.error("Failed to remove admin.");
    }
  }

  if (loading || authLoading) return <p>Loading...</p>;

  if (!isAdmin) {
    return <ErrorMessage>401 Unauthorized</ErrorMessage>;
  }

  return (
    <PageContainer>
      <Banner />
      <ContentContainer>
        <TitleSection>
          <Title>Admin Management</Title>
          <Description>
            Manage admin access for Amigos del Rios. Add or remove
            administrators who can manage routes, sessions, and team
            assignments.
          </Description>
        </TitleSection>

        <SectionCard>
          <SectionHeader>
            <SectionTitle>Add New Admin</SectionTitle>
            {!isAdding && (
              <AddAdminButton onClick={() => setIsAdding(true)}>
                {IconSvgs.add_admin}
                Add Admin
              </AddAdminButton>
            )}
          </SectionHeader>
          {isAdding && (
            <FormContainer>
              <FormField>
                <FormLabel>
                  Full Name<span>*</span>
                </FormLabel>
                <FormInput
                  placeholder="Enter admin's full name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>
                  Email Address<span>*</span>
                </FormLabel>
                <FormInput
                  placeholder="Enter admin's email address"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                />
              </FormField>
              {formError && <ErrorMessage>{formError}</ErrorMessage>}
              <FormActions>
                <GrantButton onClick={handleGrantAdmin} disabled={submitting}>
                  {submitting ? "Granting..." : "Grant Admin Access"}
                </GrantButton>
                <CancelButton
                  onClick={() => {
                    setIsAdding(false);
                    setFormError("");
                    setNewEmail("");
                    setNewName("");
                  }}
                >
                  Cancel
                </CancelButton>
              </FormActions>
            </FormContainer>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <SectionTitle>Current Admins</SectionTitle>
            <AdminCountBadge>
              {IconSvgs.admin_green}
              {admins.length} Admins
            </AdminCountBadge>
          </SectionHeader>
          <CardsContainer>
            {admins?.map(admin => (
              <AdminCard
                key={admin.id}
                name={admin.name}
                email={admin.email}
                affiliation={admin.affiliation}
                onDelete={() => handleDeleteAdmin(admin.id)}
              />
            ))}
          </CardsContainer>
        </SectionCard>
      </ContentContainer>
    </PageContainer>
  );
}
