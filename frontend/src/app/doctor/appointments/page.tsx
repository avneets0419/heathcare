"use client";

import { useEffect, useState, useCallback } from "react";
import { getDoctorAppointments, cancelAppointment, completeAppointment } from "@/services/appointment.service";
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
];

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const [sortBy, setSortBy] = useState<"time" | "status">("time");

  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
  }>({ open: false, appointment: null });

  const [rxDialog, setRxDialog] = useState({
    open: false,
    appointmentId: "",
    patientName: "",
  });

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
    await cancelAppointment(id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
  };

  const handleComplete = async (id: string) => {
    setCompleting(id);
    await completeAppointment(id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
    );
    setCompleting(null);
  };

  const filteredAndSorted = appointments
    .filter((a) => {
      const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === "all" || a.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return new Date(a.timeSlot).getTime() - new Date(b.timeSlot).getTime();
      }
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    });

  const statusStyles: Record<FilterStatus, string> = {
    all: "",
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments</h1>

        <div className="flex gap-3">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ✅ FIXED SELECT */}
          <Select
            value={sortBy}
            onValueChange={(v) => {
              if (v === "time" || v === "status") {
                setSortBy(v);
              }
            }}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">By Time</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        filteredAndSorted.map((appt) => (
          <div
            key={appt.id}
            className="p-4 border rounded-xl flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{appt.patientName}</h3>
              <p className="text-sm">
                {new Date(appt.timeSlot).toLocaleString()}
              </p>
            </div>

            <Badge className={statusStyles[appt.status]}>
              {appt.status}
            </Badge>

            <div className="flex gap-2">
              {appt.status !== "completed" && (
                <Button onClick={() => handleComplete(appt.id)}>
                  {completing === appt.id ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </Button>
              )}

              <Button variant="outline" onClick={() => handleCancel(appt.id)}>
                Cancel
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Prescription Dialog */}
      <Dialog
        open={rxDialog.open}
        onOpenChange={(open) => setRxDialog((s) => ({ ...s, open }))}
      >
        <DialogContent>
          <DialogClose>
            <XIcon />
          </DialogClose>

          <PrescriptionForm
            appointmentId={rxDialog.appointmentId}
            patientName={rxDialog.patientName}
            onSuccess={() => fetchAppointments()}
            onCancel={() => setRxDialog({ open: false, appointmentId: "", patientName: "" })}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}