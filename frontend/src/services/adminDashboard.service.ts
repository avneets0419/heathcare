import { api } from '@/lib/axios';

export interface DashboardStats {
  totalRevenue: number;
  totalPatients: number;
  totalDoctors: number;
  activeDoctors: number;
  upcomingAppointments: {
    id: string;
    patientName: string;
    type: string;
    time: string;
    status: string;
    price: number;
    createdAt: string;
  }[];
}

export const adminDashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },
  getTraffic: async (): Promise<number[]> => {
  const { data } = await api.get('/admin/traffic');
  return data;
}
};

