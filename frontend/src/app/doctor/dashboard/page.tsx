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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ── Fallback stats ────────────────────────────────────────────────────────────
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
    timeSlot: new Date(Date.now() + 3_600_000).toISOString(),
    status: "confirmed",
    notes: "Routine checkup",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Priya Nair",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() + 7_200_000).toISOString(),
    status: "pending",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Rohan Mehta",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() - 3_600_000).toISOString(),
    status: "completed",
    notes: "Follow-up for fever",
  },
];

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // Set time on client only to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(
      new Date()
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase()
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, appts] = await Promise.all([
          getDoctorStats(),
          getDoctorAppointments(),
        ]);
        setStats(s ?? MOCK_STATS);
        setAppointments(appts ?? MOCK_APPOINTMENTS);
      } catch (error) {
        console.error("Failed to fetch doctor dashboard data:", error);
        setStats(MOCK_STATS);
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todaysAppts = appointments.filter(
    (a) => new Date(a.timeSlot).toDateString() === new Date().toDateString()
  );

  return (
    <AuthGuard allowedRoles={["doctor"]}>
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 max-w-[1600px] mx-auto pb-12">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="relative">
            <div className="absolute -left-4 -top-4 w-20 h-20 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white relative z-10">
              Doctor Workspace
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-xl relative z-10">
              Manage your appointments, availability, and prescriptions efficiently.
            </p>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            {/* Status toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className="flex items-center gap-3 bg-white dark:bg-slate-800/80 p-2 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  onClick={() => setIsActive((v) => !v)}
                >
                  <div
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isActive ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </div>
                  <span className="flex flex-col text-left">
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${isActive ? "text-emerald-600" : "text-slate-500"
                        }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 leading-none">
                      Status
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Turn off to stop new bookings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Session clock */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Current Session
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {currentTime || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Alert Banner ────────────────────────────────────────────────────── */}
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-2xl p-1 shadow-sm flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-300">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="flex items-center gap-4 w-full p-3 pl-5">
            <div className="bg-rose-100 dark:bg-rose-900/60 p-2.5 rounded-xl text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6 animate-pulse" strokeWidth={2.5} />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-rose-900 dark:text-rose-300">
                  {(stats?.pendingPrescriptions ?? 0) > 0
                    ? `You have ${stats?.pendingPrescriptions} pending prescriptions`
                    : "Action Required"}
                </h4>
                <p className="text-sm font-semibold text-rose-700/90 dark:text-rose-400/80 mt-0.5">
                  {(stats?.todayAppointments ?? 0) > 5
                    ? "You are fully booked today. Expect a busy schedule."
                    : "Complete your pending administrative tasks."}
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/doctor/appointments")}
                className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 border-0 font-extrabold active:scale-95 transition-all rounded-xl h-10 px-5 text-xs uppercase tracking-widest"
              >
                Review Now →
              </Button>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Card 1: Today's Appointments */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-600 to-slate-900 dark:from-teal-800 dark:to-slate-950 p-8 rounded-3xl flex flex-col justify-between text-white shadow-2xl shadow-emerald-600/20 transition-all hover:shadow-emerald-600/30 hover:-translate-y-1 duration-500 group border border-emerald-500/50">
            <div className="absolute -right-4 -bottom-12 opacity-5 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-1000 pointer-events-none">
              <CalendarDays className="w-80 h-80" strokeWidth={3} />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-12">
              <h3 className="font-bold text-teal-50 text-lg flex items-center gap-3 tracking-tight">
                <span className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                  <Clock className="h-5 w-5 text-teal-100" />
                </span>
                Today&apos;s Appointments
              </h3>
              <span className="bg-white/10 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner border border-white/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-6xl font-black mb-3 tracking-tighter drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-br from-white to-teal-100">
                {stats?.todayAppointments ?? 0}
              </p>
              <div className="flex items-center text-xs font-bold text-teal-50 bg-black/20 w-max px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-teal-400" />
                <span>+2 from yesterday</span>
              </div>
            </div>
          </div>

          {/* Card 2: Completed Appointments */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="relative">
                <div className="relative w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-emerald-100/50 dark:border-emerald-800/30">
                  <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] mb-1">
                Completed Appointments
              </h3>
              <div className="flex items-end gap-3 mb-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {appointments.filter((a) => a.status === "completed").length}
                </p>
                <span className="mb-1 text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-md">
                  DONE
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Pending Prescriptions */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="relative w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-amber-100/50 dark:border-amber-800/30">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              {(stats?.pendingPrescriptions ?? 0) > 0 && (
                <div className="h-3 w-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm animate-bounce" />
              )}
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] mb-1">
                Pending Prescriptions
              </h3>
              <div className="flex items-end gap-3 mb-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stats?.pendingPrescriptions ?? 0}
                </p>
                {(stats?.pendingPrescriptions ?? 0) > 0 && (
                  <span className="mb-1 text-[10px] font-bold text-rose-600 flex items-center bg-rose-50 px-2 py-0.5 rounded-md uppercase">
                    Urgent
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Total Patients */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl duration-500 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-400/10 rounded-full blur-3xl group-hover:bg-sky-400/20 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="relative w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-sky-100/50 dark:border-sky-800/30">
                <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] mb-1">
                Total Patients Seen
              </h3>
              <div className="flex items-end gap-3 mb-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stats?.totalPatients ?? 0}
                </p>
                <div className="flex -space-x-2 overflow-hidden mb-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Upcoming Appointments + Quick Actions ────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Upcoming appointments */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 p-8 flex flex-col shadow-lg">
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Upcoming Appointments
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                  Scheduled for today
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-100 dark:bg-teal-900/40 px-3 py-1 text-[10px] font-black text-teal-700 dark:text-teal-300 uppercase tracking-widest">
                  {todaysAppts.length} Appointments
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-teal-600 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : todaysAppts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <CalendarDays className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">
                  No more appointments today
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {todaysAppts.map((appt, idx) => {
                  const isNext = idx === 0;
                  return (
                    <div
                      key={appt.id}
                      className={`relative group p-6 rounded-[24px] border transition-all duration-500 overflow-hidden ${isNext
                          ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-xl shadow-emerald-600/20 scale-[1.02] z-10"
                          : "bg-white text-slate-900 border-slate-100 hover:border-slate-200 hover:shadow-md dark:bg-slate-800/50 dark:text-white dark:border-slate-700"
                        }`}
                    >
                      {isNext && (
                        <div className="absolute top-0 right-0 p-4">
                          <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 shadow-inner">
                            Next UP
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border transition-colors ${isNext
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                            }`}
                        >
                          {appt.patientName?.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`font-black text-base tracking-tight ${isNext ? "text-white" : "text-slate-900 dark:text-white"
                              }`}
                          >
                            {appt.patientName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className={`h-3 w-3 ${isNext ? "text-emerald-200" : "text-slate-400"}`} />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest ${isNext ? "text-emerald-100" : "text-slate-500"
                                }`}
                            >
                              {new Date(appt.timeSlot)
                                .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
                                .toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${appt.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                            }`}
                        >
                          {appt.status}
                        </span>
                        <Button
                          size="sm"
                          className={`h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isNext
                              ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg shadow-black/10"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                            }`}
                          onClick={() => (window.location.href = "/doctor/appointments")}
                        >
                          Add Prescription <Plus className="ml-1.5 h-3 w-3" strokeWidth={3} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800/80 p-8 rounded-[32px] shadow-xl border border-slate-200/60 dark:border-slate-700/50 relative overflow-hidden group transition-all hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-900">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                <Activity className="h-20 w-20 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h4 className="text-slate-900 dark:text-white font-black text-xl mb-2 relative z-10">
                Quick Actions
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-8 relative z-10">
                Streamline your workflow
              </p>
              <div className="grid grid-cols-1 gap-4 relative z-10">
                <Button
                  variant="outline"
                  className="justify-start h-14 bg-emerald-50/30 border-emerald-100 text-slate-900 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-900/20 rounded-2xl font-bold text-sm transition-all hover:translate-x-1"
                  onClick={() => (window.location.href = "/doctor/availability")}
                >
                  <CalendarDays className="mr-4 h-5 w-5 text-emerald-500" /> Update Schedule
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-14 bg-emerald-50/30 border-emerald-100 text-slate-900 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-900/20 rounded-2xl font-bold text-sm transition-all hover:translate-x-1"
                >
                  <Users className="mr-4 h-5 w-5 text-teal-500" /> Patient Records
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-14 bg-emerald-50/30 border-emerald-100 text-slate-900 hover:bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-900/20 rounded-2xl font-bold text-sm transition-all hover:translate-x-1"
                  onClick={() => (window.location.href = "/doctor/prescriptions")}
                >
                  <FileText className="mr-4 h-5 w-5 text-emerald-400" /> Prescriptions
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
