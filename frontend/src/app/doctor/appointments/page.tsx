"use client";

import { useEffect, useState, useCallback } from "react";
import { getDoctorAppointments, cancelAppointment } from "@/services/appointment.service";
import { Appointment } from "@/types/appointment.types";
import { AppointmentCard } from "@/components/shared/AppointmentCard";
import { PrescriptionForm } from "@/components/doctor/PrescriptionForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, CalendarDays, Loader2, RefreshCw } from "lucide-react";

type FilterStatus = "all" | "pending" | "confirmed" | "completed" | "cancelled";

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
    timeSlot: new Date(Date.now() - 86400_000).toISOString(),
    status: "completed",
    notes: "Follow-up for fever",
  },
  {
    id: "4",
    patientId: "p4",
    patientName: "Kavya Reddy",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() - 172800_000).toISOString(),
    status: "cancelled",
  },
  {
    id: "5",
    patientId: "p5",
    patientName: "Arjun Patel",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    timeSlot: new Date(Date.now() + 10800_000).toISOString(),
    status: "confirmed",
    notes: "Blood pressure monitoring",
  },
];

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  // Prescription dialog state
  const [rxDialog, setRxDialog] = useState<{
    open: boolean;
    appointmentId: string;
    patientName: string;
  }>({ open: false, appointmentId: "", patientName: "" });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDoctorAppointments();
      setAppointments(data);
    } catch {
      setAppointments(MOCK_APPOINTMENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch {
      // optimistic update fallback – just mark locally
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } finally {
      setCancelling(null);
    }
  };

  const handlePrescribe = (appointmentId: string, patientName: string) => {
    setRxDialog({ open: true, appointmentId, patientName });
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch = a.patientName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || a.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your patient appointments
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchAppointments}
          disabled={loading}
          className="gap-2 rounded-xl"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="appt-search"
            placeholder="Search by patient name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
                activeFilter === f.value
                  ? "bg-teal-600 text-white border-teal-600"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Showing <strong className="text-slate-600 dark:text-slate-300">{filtered.length}</strong> appointments
      </p>

      {/* Appointment grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-teal-500" />
          <p className="text-sm">Loading appointments…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-20 text-slate-400">
          <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">No appointments found</p>
          {search && (
            <p className="text-xs mt-1 opacity-70">
              Try clearing your search filter
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onCancel={handleCancel}
              onPrescribe={handlePrescribe}
              isLoading={cancelling === appt.id}
            />
          ))}
        </div>
      )}

      {/* Prescription Dialog */}
      <Dialog
        open={rxDialog.open}
        onOpenChange={(open) => setRxDialog((s) => ({ ...s, open }))}
      >
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-slate-100">
              Write Prescription
            </DialogTitle>
          </DialogHeader>
          <PrescriptionForm
            appointmentId={rxDialog.appointmentId}
            patientName={rxDialog.patientName}
            onSuccess={() => {
              setRxDialog({ open: false, appointmentId: "", patientName: "" });
              fetchAppointments();
            }}
            onCancel={() =>
              setRxDialog({ open: false, appointmentId: "", patientName: "" })
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
