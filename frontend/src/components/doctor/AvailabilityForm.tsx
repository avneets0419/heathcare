"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addAvailabilitySlot, deleteAvailabilitySlot, getDoctorSchedule } from "@/services/doctor.service";
import { AvailabilitySlot } from "@/types/doctor.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((d) => d.startTime < d.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type FormValues = z.infer<typeof schema>;

interface AvailabilityFormProps {
  initialSlots?: AvailabilitySlot[];
  onSlotsChange?: (slots: AvailabilitySlot[]) => void;
}

export function AvailabilityForm({ initialSlots = [], onSlotsChange }: AvailabilityFormProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const newSlot = await addAvailabilitySlot(values);
      const updated = [...slots, newSlot];
      setSlots(updated);
      onSlotsChange?.(updated);
      setSuccess("Slot added successfully!");
      reset();
    } catch {
      setError("Failed to add slot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteAvailabilitySlot(id);
      const updated = slots.filter((s) => s.id !== id);
      setSlots(updated);
      onSlotsChange?.(updated);
    } catch {
      setError("Failed to remove slot.");
    } finally {
      setDeletingId(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Add slot form */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-6 shadow-sm backdrop-blur-sm">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">
          <PlusCircle className="h-4 w-4 text-teal-500" />
          Add Availability Slot
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="avail-date" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Date
              </Label>
              <Input
                id="avail-date"
                type="date"
                min={today}
                {...register("date")}
                className="rounded-xl border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500"
              />
              {errors.date && (
                <p className="text-xs text-rose-500">{errors.date.message}</p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-1.5">
              <Label htmlFor="avail-start" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Start Time
              </Label>
              <Input
                id="avail-start"
                type="time"
                {...register("startTime")}
                className="rounded-xl border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500"
              />
              {errors.startTime && (
                <p className="text-xs text-rose-500">{errors.startTime.message}</p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-1.5">
              <Label htmlFor="avail-end" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> End Time
              </Label>
              <Input
                id="avail-end"
                type="time"
                {...register("endTime")}
                className="rounded-xl border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500"
              />
              {errors.endTime && (
                <p className="text-xs text-rose-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg bg-teal-50 dark:bg-teal-950/30 px-4 py-2.5 text-sm text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900">
              {success}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Adding…</>
            ) : (
              <><PlusCircle className="h-4 w-4" /> Add Slot</>
            )}
          </Button>
        </form>
      </div>

      {/* Existing slots */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-6 shadow-sm backdrop-blur-sm">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Your Schedule
          <span className="ml-2 rounded-full bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 text-xs text-teal-700 dark:text-teal-300 font-medium">
            {slots.length} slots
          </span>
        </h3>

        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <CalendarDays className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">No availability slots added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors",
                  slot.isBooked
                    ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-4">
                  <CalendarDays className="h-4 w-4 text-teal-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(slot.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  {slot.isBooked && (
                    <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300 font-medium">
                      Booked
                    </span>
                  )}
                </div>

                {!slot.isBooked && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    onClick={() => handleDelete(slot.id)}
                    disabled={deletingId === slot.id}
                  >
                    {deletingId === slot.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
