export type PatientStatus = "active" | "inactive" | "recovered" | "under_treatment";

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    status?: PatientStatus;
    condition?: string;
    createdAt: string;
}

export interface CreatePatientPayload {
    name: string;
    email: string;
    phone: string;
    status?: PatientStatus;
    condition?: string;
}

export interface UpdatePatientPayload {
    name?: string;
    email?: string;
    phone?: string;
    status?: PatientStatus;
    condition?: string;
}