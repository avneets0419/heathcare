"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { LoginResponse } from "@/types/auth.types";
import { decodeToken } from "@/lib/decodeToken";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Activity, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const ROLE_REDIRECT: Record<string, string> = {
  doctor: "/doctor/dashboard",
  patient: "/patient/dashboard",
  admin: "/admin/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<LoginResponse>("/login", values);

      // ✅ Store ONLY token (IMPORTANT FIX)
      localStorage.setItem("token", data.token);

      // ✅ Decode token to get role
      const decoded = decodeToken(data.token);

      // ✅ Safe role-based redirect
      if (decoded?.role && ROLE_REDIRECT[decoded.role]) {
        router.push(ROLE_REDIRECT[decoded.role]);
      } else {
        router.push("/auth/login");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid email or password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950 p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-teal-900/10 dark:shadow-teal-400/5 p-8">

          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-600 shadow-lg shadow-teal-600/30">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome to Mediso
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Smart Hospital Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="login-email"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@hospital.com"
                autoComplete="email"
                {...register("email")}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="login-password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" /> Password
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 text-sm"
              />
              {errors.password && (
                <p className="text-xs text-rose-500">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/30 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Mediso
        </p>
      </div>
    </div>
  );
}