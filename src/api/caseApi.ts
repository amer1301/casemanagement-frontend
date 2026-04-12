import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// ====================
// INTERCEPTORS
// ====================

// Lägg till JWT automatiskt
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Hantera 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ====================
// CASE API
// ====================

// Hämta alla ärenden
export const getCases = () => API.get("/cases");

// Hämta användarens ärenden
export const getMyCases = () => API.get("/cases/my");

// Hämta ett ärende
export const getCaseById = (id: string) =>
  API.get(`/cases/${id}`);

// Skapa ärende
export const createCase = (data: any) =>
  API.post("/cases", data);

// Uppdatera status
export const updateCaseStatus = (id: string, status: string) =>
  API.patch(`/cases/${id}/status`, { status });

// Hämta loggar
export const getCaseLogs = (id: string) =>
  API.get(`/cases/${id}/logs`);

export default API;