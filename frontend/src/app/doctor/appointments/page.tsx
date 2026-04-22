"use client";

import { useEffect, useState, useCallback } from "react";
import { getDoctorAppointments, cancelAppointment } from "@/services/appointment.service";
import { Appointment } from "@/types/appointment.types";
import { PrescriptionForm } from "@/components/doctor/PrescriptionForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Search, 
  CalendarDays, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  ArrowUpDown,
  XIcon
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { completeAppointment } from "@/services/appointment.service";

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
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
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
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } finally {
      setCancelling(null);
    }
  };

  const handleComplete = async (id: string) => {
    setCompleting(id);
    try {
      await completeAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
      );
    } catch (error) {
      console.error("Failed to complete appointment:", error);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
      );
    } finally {
      setCompleting(null);
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

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-blue-500/20"
            />
          </div>
          <Select value={sortBy} onValueChange={(v: string | null) => v && setSortBy(v as "time" | "status")}>
            <SelectTrigger className="w-[140px] h-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3 text-slate-400" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
              <SelectItem value="time">By Time</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Tabs Section */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
              activeFilter === f.value
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:border-white"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
            }`}
          >
            {f.label}
          </button>
        ))}
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

        {/* 🔹 FOOTER (FIXED BUTTONS) */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="flex flex-wrap gap-3">

            {/* Write Prescription */}
            {detailsModal.appointment.status && ["confirmed", "pending"].includes(detailsModal.appointment.status.toLowerCase()) && (
              <Button
                className="flex-1 min-w-[150px] h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
                onClick={() =>
                  handlePrescribe(
                    detailsModal.appointment!.id,
                    detailsModal.appointment!.patientName
                  )
                }
              >
                Write Prescription
              </Button>
            )}

            {/* Mark Completed */}
            {detailsModal.appointment.status && !["completed", "cancelled"].includes(detailsModal.appointment.status.toLowerCase()) && (
              <Button
                className="flex-1 min-w-[150px] h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition"
                onClick={() => handleComplete(detailsModal.appointment!.id)}
              >
                Mark Completed
              </Button>
            )}

            {/* Cancel */}
            {!["cancelled"].includes(detailsModal.appointment.status.toLowerCase()) && (
              <Button
                variant="outline"
                className="flex-1 min-w-[150px] h-11 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                onClick={() => handleCancel(detailsModal.appointment!.id)}
                disabled={cancelling === detailsModal.appointment.id}
              >
                {cancelling === detailsModal.appointment.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Cancel
              </Button>
            )}

          </div>
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