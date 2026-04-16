"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/shared/AuthGuard";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userName = "Doctor";

  return (
    <AuthGuard allowedRoles={["doctor"]}>
      <DashboardLayout role="doctor" userName={userName}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
