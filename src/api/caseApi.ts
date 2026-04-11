import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Lägg till JWT automatiskt
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Hämta alla ärenden
export const getCases = () => API.get("/cases");

// Uppdatera status
export const updateStatus = (id: number, status: string) =>
  API.patch(`/cases/${id}/status`, { status });

// Skapa ärenden
export const CreateCase = (data: any) =>
  API.post("/cases", data);

export default API;