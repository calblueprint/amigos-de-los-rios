"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById } from "@/actions/supabase/queries/users";
import { useAuth } from "@/app/utils/AuthContext";
import AdminCard from "@/components/AdminCard/Admin";
import Banner from "@/components/Banner/Banner";
import { IconSvgs } from "@/lib/icons";
import {
  AddAdminButton,
  AdminCountBadge,
  CardsContainer,
  ContentContainer,
  Description,
  ErrorMessage,
  PageContainer,
  SectionCard,
  SectionHeader,
  SectionTitle,
  Title,
  TitleSection,
} from "./styles";

const admins = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@amigosdelrios.org",
    dateAdded: "Jan 4, 2025",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@amigosdelrios.org",
    dateAdded: "Jan 4, 2025",
  },
];

export default function AdminPage() {
  const { userId, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [userId, authLoading, router]);

  if (loading || authLoading) return <p>Loading...</p>;

  if (!isAdmin) {
    return (
      <ErrorMessage>
        <h2>401 Unauthorized</h2>
      </ErrorMessage>
    );
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
            <AddAdminButton>
              {IconSvgs.add_admin}
              Add Admin
            </AddAdminButton>
          </SectionHeader>
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <SectionTitle>Current Admins</SectionTitle>
            <AdminCountBadge>
              {IconSvgs.admin_group}
              {admins.length} Admins
            </AdminCountBadge>
          </SectionHeader>
          <CardsContainer>
            {admins.map(admin => (
              <AdminCard
                key={admin.id}
                name={admin.name}
                email={admin.email}
                dateAdded={admin.dateAdded}
              />
            ))}
          </CardsContainer>
        </SectionCard>
      </ContentContainer>
    </PageContainer>
  );
}
