"use client";

import AuthGuard from "@/components/shared/AuthGuard";

export default function PatientDashboardPage() {
  return (
    <AuthGuard allowedRoles={["patient"]}>
      <div>
        <h1>Patient Dashboard</h1>
        <p>Welcome! You can manage your health here.</p>
      </div>
    </AuthGuard>
  );
}