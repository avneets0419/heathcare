"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/shared/AuthGuard";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userName = "Patient";

  return (
    <AuthGuard allowedRoles={["patient"]}>
      <DashboardLayout role="patient" userName={userName}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
