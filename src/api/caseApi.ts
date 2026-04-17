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
// AUTH API
// ====================

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/api/auth/register", data);
};

export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return API.post("/api/auth/login", data);
};

// ====================
// CASE API
// ====================

export const getCases = () => API.get("/cases");

export const getMyCases = () => API.get("/cases/my");

export const getCaseById = (id: string) =>
  API.get(`/cases/${id}`);

export const getCaseLogs = (id: string) =>
  API.get(`/cases/${id}/logs`);

export const createCase = (data: any) =>
  API.post("/cases", data);

export const deleteCase = (id: number) => {
  return API.delete(`/cases/${id}`);
};

export const deleteNotification = (id: number) =>
  API.delete(`/notifications/${id}`);

export const updateCaseStatus = (
  id: string,
  status: string,
  reason?: string
) => {
  return API.patch(`/cases/${id}/status`, {
    status,
    reason,
  });
};

export const assignCase = (id: string) =>
  API.patch(`/cases/${id}/assign`);

export const getDashboard = () =>
  API.get("/cases/dashboard");

export const getAdminStats = () =>
  API.get("/cases/dashboard/admins");

export const getUnassignedCases = () =>
  API.get("/cases/unassigned");

export const getAssignedCases = () =>
  API.get("/cases/assigned");

export const appealCase = (id: string, reason: string) =>
  API.post(`/cases/${id}/appeal`, { reason });

export const requestAdminRole = () =>
  API.post("/cases/request-admin");

export const approveRole = (id: string) =>
  API.post(`/cases/${id}/approve-role`);

export const rejectRole = (id: string) =>
  API.post(`/cases/${id}/reject-role`);

// ====================
// NOTIFICATIONS API
// ====================

export const getNotifications = () =>
  API.get("/notifications");

export const markNotificationsAsRead = () =>
  API.patch("/notifications/read-all");

export const getUnreadCount = () =>
  API.get("/notifications/unread-count");

// ====================
// NOTES API
// ====================

export const getNotes = (caseId: string) =>
  API.get(`/cases/${caseId}/notes`);

export const addNote = (caseId: string, text: string) =>
  API.post(`/cases/${caseId}/notes`, { text });

// ====================
// REPORTS API
// ====================

export const downloadMonthlyReport = async () => {
  const res = await API.get("/reports/monthly", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "monthly-report.csv");
  document.body.appendChild(link);
  link.click();
};

export default API;