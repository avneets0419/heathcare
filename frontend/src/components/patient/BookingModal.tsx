"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { PatientDoctor } from "./DoctorCard";
import { Clock, CheckCircle2, Loader2, X } from "lucide-react";

interface Slot {
  time: string;
  isBooked: boolean;
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: PatientDoctor | null;
  onConfirm: (slot: string) => Promise<void>;
}

const MOCK_SLOTS: Slot[] = [
  { time: "09:00 AM", isBooked: true },
  { time: "10:00 AM", isBooked: false },
  { time: "11:00 AM", isBooked: false },
  { time: "02:00 PM", isBooked: false },
  { time: "03:00 PM", isBooked: true },
  { time: "04:30 PM", isBooked: false },
];

export function BookingModal({ open, onOpenChange, doctor, onConfirm }: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    try {
      await onConfirm(selectedSlot);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedSlot(null);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    if (loading) return;
    setSuccess(false);
    setSelectedSlot(null);
    onOpenChange(false);
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetAndClose(); }}>
      <DialogContent className="max-w-md w-full rounded-[28px] p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden" showCloseButton={false}>
        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Appointment booked successfully</h3>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              You will receive a confirmation shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
              <div className="flex-1">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-3">
                  Book Appointment
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {doctor.name}
                </h2>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                  {doctor.specialization}
                </p>
              </div>
              <DialogClose className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0" onClick={resetAndClose}>
                <X className="h-5 w-5 text-slate-500" />
              </DialogClose>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-500" /> Available Time Slots
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.isBooked || loading}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`h-11 rounded-xl text-xs font-bold transition-all ${
                        slot.isBooked
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                          : selectedSlot === slot.time
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold shadow-lg transition-all active:scale-95 text-sm uppercase tracking-widest"
                disabled={!selectedSlot || loading}
                onClick={handleConfirm}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Appointment"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
