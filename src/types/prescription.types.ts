export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  medicines: Medicine[];
  notes: string;
  createdAt: string;
}

export interface CreatePrescriptionPayload {
  appointmentId: string;
  medicines: Medicine[];
  notes: string;
}
