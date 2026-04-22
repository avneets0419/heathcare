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

/** PATCH /appointments/:id/complete — mark an appointment as completed (Placeholder) */
export const completeAppointment = async (): Promise<void> => {
  // Simulate API call for design purposes
  await new Promise(resolve => setTimeout(resolve, 800));
  // await api.patch(`/appointments/${id}/complete`);
};
