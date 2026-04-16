"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/shared/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userName = "Admin";

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <DashboardLayout role="admin" userName={userName}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
