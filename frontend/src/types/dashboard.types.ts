export interface DashboardAlert {
    id: string;
    message: string;
    type: string;
}

export interface DashboardTraffic {
    id: string;
    day: string;
    patientCount: number;
}

export interface DashboardAppointment {
    id: string;
    patientName: string;
    type: string;
    time: string;
    status: string;
}

export interface DashboardData {
    revenue: number;
    patients: number;
    doctors: number;
    alerts: DashboardAlert[];
    traffic: DashboardTraffic[];
    appointments: DashboardAppointment[];
}