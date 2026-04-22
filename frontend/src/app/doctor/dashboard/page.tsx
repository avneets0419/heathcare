"use client";

import { useEffect, useState } from "react";
import { getDoctorStats } from "@/services/doctor.service";
import { getDoctorAppointments } from "@/services/appointment.service";
import { DoctorStats } from "@/types/doctor.types";
import { Appointment } from "@/types/appointment.types";
import { Loader2, Plus } from "lucide-react";
import AuthGuard from "@/components/shared/AuthGuard";
import { Button } from "@/components/ui/button";

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
  const [isActive, setIsActive] = useState(true);

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
        setStats(MOCK_STATS);
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todaysAppts = appointments.filter(
    (a) =>
      new Date(a.timeSlot).toDateString() ===
      new Date().toDateString()
  );

  return (
    <AuthGuard allowedRoles={["doctor"]}>
      <div className="space-y-8 max-w-[1600px] mx-auto pb-12">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black">Doctor Workspace</h1>

          <div
            onClick={() => setIsActive(!isActive)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold ${
              isActive ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* ALERT */}
        <div className="p-4 bg-red-100 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-bold">
              {stats?.pendingPrescriptions ?? 0} pending prescriptions
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/doctor/appointments")}>
            Review
          </Button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <p>Today</p>
            <h2 className="text-2xl font-bold">
              {stats?.todayAppointments ?? 0}
            </h2>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <p>Completed</p>
            <h2 className="text-2xl font-bold">
              {appointments.filter((a) => a.status === "completed").length}
            </h2>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <p>Pending</p>
            <h2 className="text-2xl font-bold">
              {stats?.pendingPrescriptions ?? 0}
            </h2>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <p>Patients</p>
            <h2 className="text-2xl font-bold">
              {stats?.totalPatients ?? 0}
            </h2>
          </div>
        </div>

        {/* APPOINTMENTS */}
        <div>
          {/* ✅ FIXED HERE */}
          <h2 className="text-xl font-bold mb-4">
            Today&apos;s Appointments
          </h2>

          {loading ? (
            <Loader2 className="animate-spin" />
          ) : todaysAppts.length === 0 ? (
            <p>No appointments</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {todaysAppts.map((appt) => (
                <div key={appt.id} className="p-4 border rounded-xl">
                  <p className="font-bold">{appt.patientName}</p>
                  <p>
                    {new Date(appt.timeSlot).toLocaleTimeString()}
                  </p>

                  <Button className="mt-2">
                    Add Prescription{" "}
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}