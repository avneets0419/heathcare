export interface User {
  id: string;
  name?: string;
  email: string;
  passwordHash: string;
  role: "admin" | "doctor" | "patient";
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}
