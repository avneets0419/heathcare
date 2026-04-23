import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name?: string;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};