"use client";

import { useEffect, useState, useCallback } from "react";
import { getDoctorAppointments, cancelAppointment, completeAppointment } from "@/services/appointment.service";
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
import {
  Search,
  CalendarDays,
  Loader2,
  Clock,
  CheckCircle2,
  ArrowUpDown,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type FilterStatus = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  completed: 2,
  cancelled: 3,
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

  const [sortBy, setSortBy] = useState<"time" | "status">("time");
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
  }>({ open: false, appointment: null });

  const [completing, setCompleting] = useState<string | null>(null);

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

  const filteredAndSorted = appointments
    .filter((a) => {
      const matchesSearch = a.patientName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || a.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return new Date(a.timeSlot).getTime() - new Date(b.timeSlot).getTime();
      } else {
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      }
    });

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const statusStyles: Record<FilterStatus, string> = {
    all: "",
    pending: "bg-amber-100/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200/50",
    confirmed: "bg-blue-100/50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200/50",
    completed: "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200/50",
    cancelled: "bg-rose-100/50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-200/50",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-16 h-16 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white relative z-10">
            Appointments
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest relative z-10">
            Manage your daily workflow
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
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${activeFilter === f.value
              ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:border-white"
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 3. Appointment List */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
            <p className="text-sm font-bold uppercase tracking-widest">Gathering records...</p>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <CalendarDays className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">No appointments found</p>
          </div>
        ) : (
          filteredAndSorted.map((appt) => (
            <div
              key={appt.id}
              onClick={() => setDetailsModal({ open: true, appointment: appt })}
              className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-blue-400/30 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 dark:group-hover:bg-blue-900/20 transition-colors shrink-0">
                  {appt.patientName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white truncate tracking-tight mb-1 uppercase">
                    {appt.patientName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {new Date(appt.timeSlot).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {new Date(appt.timeSlot).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex justify-center shrink-0">
                <Badge
                  variant="outline"
                  className={`border-0 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${statusStyles[appt.status]}`}
                >
                  {appt.status}
                </Badge>
              </div>

              <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setDetailsModal({ open: true, appointment: appt })}
                >
                  View Details
                </Button>
                {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                  <Button
                    className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                    disabled={completing === appt.id}
                    onClick={() => handleComplete(appt.id)}
                  >
                    {completing === appt.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <CheckCircle2 className="h-3 w-3 mr-2" />}
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Details Modal */}
      <Dialog
        open={detailsModal.open}
        onOpenChange={(open) => setDetailsModal((s) => ({ ...s, open }))}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl w-full rounded-[28px] p-0 overflow-hidden border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col"
        >
          {detailsModal.appointment && (
            <>
              {/* 🔹 HEADER */}
              <div className="relative px-8 py-6 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-slate-200">
                {/* Close */}
                <DialogClose className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 transition">
                  <X className="h-5 w-5 text-slate-500" />
                </DialogClose>

                {/* Status */}
                <Badge className={`mb-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${statusStyles[detailsModal.appointment.status]}`}>
                  {detailsModal.appointment.status}
                </Badge>

                {/* Patient */}
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {detailsModal.appointment.patientName}
                </h2>

                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
                  Appointment ID: #{detailsModal.appointment.id}
                </p>
              </div>

              {/* 🔹 BODY */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* INFO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition">
                    <p className="text-xs text-slate-400 uppercase mb-1">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(detailsModal.appointment.timeSlot).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition">
                    <p className="text-xs text-slate-400 uppercase mb-1">Time</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(detailsModal.appointment.timeSlot).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition">
                    <p className="text-xs text-slate-400 uppercase mb-1">Patient ID</p>
                    <p className="font-semibold text-slate-900">
                      {detailsModal.appointment.patientId}
                    </p>
                  </div>

                </div>

                {/* CLINICAL NOTES */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-widest">
                    Clinical Notes
                  </p>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
                    {detailsModal.appointment.notes || "No notes available."}
                  </div>
                </div>

              </div>

              {/* 🔹 FOOTER (FIXED BUTTONS) */}
              <div className="p-6 border-t border-slate-200 bg-white">
                <div className="flex flex-wrap gap-3">

                  {/* Write Prescription */}
                  {detailsModal.appointment.status && ["confirmed", "pending"].includes(detailsModal.appointment.status.toLowerCase()) && (
                    <Button
                      className="flex-1 min-w-[150px] h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
                      onClick={() => {
                        if (detailsModal.appointment) {
                          handlePrescribe(
                            detailsModal.appointment.id,
                            detailsModal.appointment.patientName
                          )
                        }
                      }}
                    >
                      Write Prescription
                    </Button>
                  )}

                  {/* Mark Completed */}
                  {detailsModal.appointment.status && !["completed", "cancelled"].includes(detailsModal.appointment.status.toLowerCase()) && (
                    <Button
                      className="flex-1 min-w-[150px] h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition"
                      onClick={() => {
                        if (detailsModal.appointment) {
                          handleComplete(detailsModal.appointment.id)
                        }
                      }}
                    >
                      Mark Completed
                    </Button>
                  )}

                  {/* Cancel */}
                  {!["cancelled"].includes(detailsModal.appointment.status.toLowerCase()) && (
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[150px] h-11 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                      onClick={() => {
                        if (detailsModal.appointment) {
                          handleCancel(detailsModal.appointment.id)
                        }
                      }}
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
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 5. Prescription Dialog (Existing) */}
      <Dialog
        open={rxDialog.open}
        onOpenChange={(open) => setRxDialog((s) => ({ ...s, open }))}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-6xl rounded-[32px] p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 relative z-10">
            <DialogClose className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-[100] p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-6 w-6 md:h-7 md:h-7" />
            </DialogClose>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight relative z-10">Write Prescription</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Patient: {rxDialog.patientName}</p>
          </div>
          <div className="p-8">
            <PrescriptionForm
              appointmentId={rxDialog.appointmentId}
              patientName={rxDialog.patientName}
              onSuccess={() => {
                setRxDialog({ open: false, appointmentId: "", patientName: "" });
                setDetailsModal({ open: false, appointment: null });
                fetchAppointments();
              }}
              onCancel={() =>
                setRxDialog({ open: false, appointmentId: "", patientName: "" })
              }
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
