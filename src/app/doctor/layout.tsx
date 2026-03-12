"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEffect, useState } from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Doctor");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw) as { name?: string };
        if (user.name) setUserName(user.name);
      }
    } catch {
      // silently keep default
    }
  }, []);

  return (
    <DashboardLayout role="doctor" userName={userName}>
      {children}
    </DashboardLayout>
  );
}
