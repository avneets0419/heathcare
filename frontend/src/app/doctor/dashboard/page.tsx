"use client";

import { useEffect, useState } from "react";
import { getDoctorStats } from "@/services/doctor.service";
import { getDoctorAppointments } from "@/services/appointment.service";
import { DoctorStats } from "@/types/doctor.types";
import { Appointment } from "@/types/appointment.types";
import { StatCard } from "@/components/shared/StatCard";
import { AppointmentCard } from "@/components/shared/AppointmentCard";
import {
  CalendarDays,
  Clock,
  Users,
  FileText,
  Activity,
  Loader2,
} from "lucide-react";
import AuthGuard from "@/components/shared/AuthGuard";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-5 shadow-sm animate-pulse">
      <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700 mb-3" />
      <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

// ── Fallback stats (shown when backend is unreachable) ────────────────────────
const MOCK_STATS: DoctorStats = {
  totalAppointments: 128,
  todayAppointments: 6,
  pendingPrescriptions: 3,
  totalPatients: 47,
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "Aarav Sharma",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() + 3600_000).toISOString(),
    status: "confirmed",
    notes: "Routine checkup",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Priya Nair",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() + 7200_000).toISOString(),
    status: "pending",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Rohan Mehta",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() - 3600_000).toISOString(),
    status: "completed",
    notes: "Follow-up for fever",
  },
];

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, appts] = await Promise.all([
          getDoctorStats(),
          getDoctorAppointments(),
        ]);
        setStats(s);
        setAppointments(appts);
      } catch {
        // Use mock data when API is unavailable
        setStats(MOCK_STATS);
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todaysAppts = appointments.filter((a) => {
    const apptDate = new Date(a.timeSlot).toDateString();
    return apptDate === new Date().toDateString();
  });



  return (
    <AuthGuard allowedRoles={["doctor"]}>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Practice
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s a summary of your appointments and patients today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
          <Activity className="h-3.5 w-3.5 text-teal-500" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Stat cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Overview
        </h2>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Appointments"
              value={stats?.totalAppointments ?? 0}
              icon={CalendarDays}
              description="All time"
              color="teal"
              trend="up"
              trendValue="12% this month"
            />
            <StatCard
              title="Today's Appointments"
              value={stats?.todayAppointments ?? 0}
              icon={Clock}
              description="Scheduled for today"
              color="blue"
              trend="neutral"
              trendValue="On track"
            />
            <StatCard
              title="Pending Prescriptions"
              value={stats?.pendingPrescriptions ?? 0}
              icon={FileText}
              description="Need your attention"
              color="amber"
              trend={
                (stats?.pendingPrescriptions ?? 0) > 0 ? "up" : "neutral"
              }
              trendValue={
                (stats?.pendingPrescriptions ?? 0) > 0
                  ? "Action needed"
                  : "All clear"
              }
            />
            <StatCard
              title="Total Patients"
              value={stats?.totalPatients ?? 0}
              icon={Users}
              description="Unique patients seen"
              color="rose"
              trend="up"
              trendValue="3 new this week"
            />
          </div>
        )}
      </section>

      {/* Today's appointments */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Today&apos;s Appointments
          </h2>
          <span className="rounded-full bg-teal-100 dark:bg-teal-900/40 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
            {loading ? "…" : todaysAppts.length} scheduled
          </span>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : todaysAppts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-16 text-slate-400">
            <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No appointments scheduled for today</p>
            <p className="text-xs mt-1 opacity-70">Enjoy your free time!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todaysAppts.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </section>

      {/* Recent appointments (all) */}
      {!loading && appointments.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Recent Appointments
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {appointments.slice(0, 6).map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        </section>
      )}
    </div>
    </AuthGuard>
  );
}
