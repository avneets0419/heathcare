"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "@/lib/decodeToken";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const AuthGuard = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const decoded = decodeToken(token);

      if (!decoded) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      if (!allowedRoles.includes(decoded.role)) {
        if (decoded.role === "admin") router.push("/admin/dashboard");
        else if (decoded.role === "doctor") router.push("/doctor/dashboard");
        else router.push("/patient/dashboard");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;