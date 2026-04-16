"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Activity, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import Link from "next/link";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
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
      await api.post("/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      // Redirect to login page on success
      router.push("/auth/login");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950 p-4 py-12">
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
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Register as a patient below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="register-name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <UserIcon className="h-3.5 w-3.5" /> Full Name
              </Label>
              <Input
                id="register-name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                {...register("name")}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 text-sm"
              />
              {errors.name && (
                <p className="text-xs text-rose-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="register-email"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
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
                htmlFor="register-password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" /> Password
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 text-sm"
              />
              {errors.password && (
                <p className="text-xs text-rose-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="register-confirm-password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" /> Confirm Password
              </Label>
              <Input
                id="register-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 text-sm"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all text-white font-semibold text-sm shadow-md shadow-teal-600/30 gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account…
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Mediso · Smart Hospital Management
        </p>
      </div>
    </div>
  );
}
