import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token && config.headers instanceof AxiosHeaders) {
      // ✅ NO any, clean TypeScript
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return config;
});

export default api;