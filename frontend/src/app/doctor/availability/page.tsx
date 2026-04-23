"use client";

import { useEffect, useState } from "react";
import { getDoctorSchedule } from "@/services/doctor.service";
import { AvailabilitySlot } from "@/types/doctor.types";
import { AvailabilityForm } from "@/components/doctor/AvailabilityForm";
import { CalendarDays, Loader2 } from "lucide-react";

const MOCK_SLOTS: AvailabilitySlot[] = [
  {
    id: "s1",
    doctorId: "d1",
    date: new Date(Date.now() + 86400_000).toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    isBooked: false,
  },
  {
    id: "s2",
    doctorId: "d1",
    date: new Date(Date.now() + 86400_000).toISOString().split("T")[0],
    startTime: "11:00",
    endTime: "12:00",
    isBooked: true,
  },
  {
    id: "s3",
    doctorId: "d1",
    date: new Date(Date.now() + 172800_000).toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:00",
    isBooked: false,
  },
];

export default function DoctorAvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getDoctorSchedule();
        setSlots(data);
      } catch {
        setSlots(MOCK_SLOTS);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Availability
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage the time slots when patients can book appointments with you
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
        <CalendarDays className="h-4 w-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Slots marked as <strong>Booked</strong> have a patient appointment associated and cannot be deleted. Add future dates only.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-teal-500" />
          <p className="text-sm">Loading your schedule…</p>
        </div>
      ) : (
        <AvailabilityForm
          initialSlots={slots}
          onSlotsChange={(updated) => setSlots(updated)}
        />
      )}
    </div>
  );
}
