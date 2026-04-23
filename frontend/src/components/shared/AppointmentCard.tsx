"use client";

import { Appointment, AppointmentStatus } from "@/types/appointment.types";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onPrescribe?: (appointmentId: string, patientName: string) => void;
  isLoading?: boolean;
}

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  },
};

export function AppointmentCard({
  appointment,
  onCancel,
  onPrescribe,
  isLoading,
}: AppointmentCardProps) {
  const { label, className } = statusConfig[appointment.status];

  const dateObj = new Date(appointment.timeSlot);
  const dateStr = dateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        {/* Patient info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border border-white dark:border-slate-700 shadow-sm">
            <span className="font-bold text-sm tracking-widest text-teal-700 dark:text-teal-300">
              {appointment.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
              {appointment.patientName}
            </p>
            {appointment.notes && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {appointment.notes}
              </p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            className
          )}
        >
          {label}
        </span>
      </div>

      {/* Date & time */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md">
            <Calendar className="h-4 w-4 text-slate-400" />
            {dateStr}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md">
            <Clock className="h-4 w-4 text-slate-400" />
            {timeStr}
          </div>
        </div>
      </div>

      {/* Actions */}
      {(onCancel || onPrescribe) &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed" && (
          <div className="mt-4 flex gap-2">
            {onPrescribe && appointment.status === "confirmed" && (
              <Button
                size="sm"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                onClick={() =>
                  onPrescribe(appointment.id, appointment.patientName)
                }
                disabled={isLoading}
              >
                Write Prescription
              </Button>
            )}
            {onCancel && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                onClick={() => onCancel(appointment.id)}
                disabled={isLoading}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Cancel
              </Button>
            )}
          </div>
        )}
    </div>
  );
}
