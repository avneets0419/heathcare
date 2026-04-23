import api from "@/lib/axios";
import { Appointment } from "@/types/appointment.types";

/** GET /appointments  — returns all appointments for the logged-in doctor */
export const getDoctorAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get<Appointment[]>("/appointments");
  return data;
};

/** DELETE /appointments/:id  — cancel an appointment */
export const cancelAppointment = async (id: string): Promise<void> => {
  await api.delete(`/appointments/${id}`);
};
