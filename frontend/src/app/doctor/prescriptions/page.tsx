"use client";

import { useEffect, useState } from "react";
import { getDoctorPrescriptions } from "@/services/doctor.service";
import { Prescription } from "@/types/prescription.types";
import { FileText, Pill, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx1",
    appointmentId: "1",
    patientId: "p1",
    patientName: "Aarav Sharma",
    medicines: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "7 days",
      },
      {
        name: "Paracetamol",
        dosage: "650mg",
        frequency: "As needed",
        duration: "3 days",
      },
    ],
    notes: "Take medicines after meals. Drink plenty of water.",
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: "rx2",
    appointmentId: "3",
    patientId: "p3",
    patientName: "Rohan Mehta",
    medicines: [
      {
        name: "Azithromycin",
        dosage: "250mg",
        frequency: "Once daily",
        duration: "5 days",
      },
    ],
    notes: "Follow-up after 5 days if symptoms persist.",
    createdAt: new Date(Date.now() - 172800_000).toISOString(),
  },
];

function PrescriptionAccordion({ rx }: { rx: Prescription }) {
  const [open, setOpen] = useState(false);

  const date = new Date(rx.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden transition-all duration-200">
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
            <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-left min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
              {rx.patientName}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {rx.medicines.length} medicine{rx.medicines.length !== 1 ? "s" : ""} · {date}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-700/50 pt-4">
          {/* Medicines table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-2.5 text-left font-semibold">Medicine</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Dosage</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Frequency</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {rx.medicines.map((med, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-t border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-300",
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-800/40"
                        : "bg-slate-50/50 dark:bg-slate-800/20"
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium">{med.name}</td>
                    <td className="px-4 py-2.5">{med.dosage}</td>
                    <td className="px-4 py-2.5">{med.frequency}</td>
                    <td className="px-4 py-2.5">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {rx.notes && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                Doctor&apos;s Notes
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{rx.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRx = async () => {
      try {
        const data = await getDoctorPrescriptions();
        setPrescriptions(data);
      } catch {
        setPrescriptions(MOCK_PRESCRIPTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchRx();
  }, []);

  const filtered = prescriptions.filter((rx) =>
    rx.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Prescriptions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View all prescriptions you have written
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          id="rx-search"
          placeholder="Search by patient name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        <strong className="text-slate-600 dark:text-slate-300">{filtered.length}</strong> prescription{filtered.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-teal-500" />
          <p className="text-sm">Loading prescriptions…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-20 text-slate-400">
          <FileText className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">No prescriptions found</p>
          {search && (
            <p className="text-xs mt-1 opacity-70">Try clearing your search</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rx) => (
            <PrescriptionAccordion key={rx.id} rx={rx} />
          ))}
        </div>
      )}
    </div>
  );
}
