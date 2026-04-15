import axios from "axios";
import { getToken } from "../context/authContext";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// ====================
// INTERCEPTORS
// ====================

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export const getCases = () => API.get("/cases");

export const getMyCases = () => API.get("/cases/my");

export const getCaseById = (id: string) =>
  API.get(`/cases/${id}`);

export const getCaseLogs = (id: string) =>
  API.get(`/cases/${id}/logs`);

export const updateCaseStatus = (id: string, status: string) => {
  return API.patch(`/cases/${id}/status`, {
    status: status,
  });
};

export const createCase = (data: any) =>
  API.post("/cases", data);

export const getDashboard = () => API.get("/cases/dashboard");

export const assignCase = (id: string) =>
  API.patch(`/cases/${id}/assign`);

export default API;