import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/admin` : 'http://localhost:5001/api/admin',
  withCredentials: true
});

export const adminService = {
  getDoctors: async (search: string = "", specialization: string = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (specialization) params.append("specialization", specialization);
    const { data } = await api.get(`/doctors?${params.toString()}`);
    return data;
  },
  
  createDoctor: async (doctorData: Record<string, unknown>) => {
    const { data } = await api.post('/doctors', doctorData);
    return data;
  },

  updateDoctor: async (id: string, doctorData: Record<string, unknown>) => {
    const { data } = await api.put(`/doctors/${id}`, doctorData);
    return data;
  },

  deleteDoctor: async (id: string) => {
    const { data } = await api.delete(`/doctors/${id}`);
    return data;
  }
};
