"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { PatientDoctor, DoctorCard } from "@/components/patient/DoctorCard";
import { BookingModal } from "@/components/patient/BookingModal";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Users } from "lucide-react";

// Fallback data in case the API is empty or unavailable
const MOCK_DOCTORS: PatientDoctor[] = [
  { id: "d1", name: "Dr. Sarah Smith", specialization: "Cardiologist", isAvailable: true, rating: 4.9 },
  { id: "d2", name: "Dr. John Doe", specialization: "Dentist", isAvailable: true, rating: 4.7 },
  { id: "d3", name: "Dr. Emily Chen", specialization: "Neurologist", isAvailable: false, rating: 4.8 },
  { id: "d4", name: "Dr. Michael Brown", specialization: "General", isAvailable: true, rating: 4.6 },
  { id: "d5", name: "Dr. Jessica Wilson", specialization: "Cardiologist", isAvailable: true, rating: 5.0 },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<PatientDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const [selectedDoctor, setSelectedDoctor] = useState<PatientDoctor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/doctors");
      if (Array.isArray(data) && data.length > 0) {
        setDoctors(data.map((d: { id: string; name: string; specialization: string; status: string; image?: string }) => ({
          id: d.id,
          name: d.name,
          specialization: d.specialization,
          isAvailable: d.status === "Active",
          rating: 4.5 + Math.random() * 0.5,
          image: d.image
        })));
      } else {
        setDoctors(MOCK_DOCTORS);
      }
    } catch {
      setDoctors(MOCK_DOCTORS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleBookClick = (doctor: PatientDoctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleConfirmBooking = async (slot: string) => {
    // Simulate booking API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const specializations = ["All", ...Array.from(new Set(doctors.map(d => d.specialization)))];

  const filtered = doctors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || d.specialization === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white relative z-10">
            Find Doctors
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest relative z-10">
            Choose a doctor and book appointment
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search doctor by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {specializations.map((spec) => (
          <button
            key={spec}
            onClick={() => setActiveFilter(spec)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
              activeFilter === spec
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:border-white"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* 3. Doctors List */}
      <div className="pt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-500" />
            <p className="text-sm font-bold uppercase tracking-widest">Loading doctors...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Users className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">No doctors available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBookClick} />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        doctor={selectedDoctor}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}