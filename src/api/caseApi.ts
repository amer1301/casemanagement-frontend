import axios from "axios";
import { getToken } from "../context/authContext";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
/**
 * Helper för att extrahera data från backendens standardiserade ApiResponse.
 * Backend returnerar: { success, data, message }
 */
const unwrap = (res: any) => res.data.data;

/**
 * Request interceptor:
 * - Lägger automatiskt till JWT-token i Authorization-header
 */
API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response interceptor:
 * - Hanterar 401 (unauthorized)
 * - Loggar ut användaren och redirectar till login
 */
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

// AUTH API

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await API.post("/api/auth/register", data);
  return unwrap(res);
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/api/auth/login", data);
  return unwrap(res);
};

// CASE API

export const getCases = async (params: {
  page?: number;
  size?: number;
  status?: string;
  q?: string;
  sortBy?: string;
  direction?: string;
  assignedTo?: number;
}) => {
  const res = await API.get("/cases", { params });
  return res.data;
};

export const getMyCases = async () => unwrap(await API.get("/cases/my"));

export const getCaseById = async (id: string) =>
  unwrap(await API.get(`/cases/${id}`));

export const getCaseLogs = async (id: string) =>
  unwrap(await API.get(`/cases/${id}/logs`));

export const createCase = async (data: {
  title: string;
  description: string;
  category: string;
  personalNumber: string;
  applicantName: string;
}) => unwrap(await API.post("/cases", data));

export const deleteCase = async (id: number) =>
  unwrap(await API.delete(`/cases/${id}`));

export const deleteNote = async (noteId: number) => {
  await API.delete(`/notes/${noteId}`);
};

export const updateCaseStatus = async (
  id: string,
  status: string,
  reason?: string
) =>
  unwrap(
    await API.patch(`/cases/${id}/status`, {
      status,
      reason,
    })
  );

export const assignCase = async (id: string) =>
  unwrap(await API.patch(`/cases/${id}/assign`));

export const getUnassignedCases = async () =>
  unwrap(await API.get("/cases/unassigned"));

export const getAssignedCases = async () =>
  unwrap(await API.get("/cases/assigned"));

export const appealCase = async (id: string, reason: string) =>
  unwrap(await API.post(`/cases/${id}/appeal`, { reason }));

export const requestAdminRole = async () => {
  const res = await API.post("/api/role-requests");
  return res.data;
};

export const getAllRoleRequests = async () => {
  const res = await API.get("/api/role-requests");
  return res.data;
};

export const deleteRoleRequest = async (id: number) => {
  await API.delete(`/api/role-requests/${id}`);
};

export const approveRole = async (id: number) =>
  unwrap(await API.post(`/api/role-requests/${id}/approve`));

export const rejectRole = async (id: number) =>
  unwrap(await API.post(`/api/role-requests/${id}/reject`));

export const getMyRoleRequests = async () => {
  const res = await API.get("/api/role-requests/my");
  return res.data;
};

export const updatePriority = async (id: number, priority: number) =>
  unwrap(await API.put(`/cases/${id}/priority`, { priority }));

// NOTIFICATIONS API

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const deleteNotification = async (id: number) => {
  await API.delete(`/notifications/${id}`);
};

export const markNotificationsAsRead = async () => {
  await API.patch("/notifications/read-all");
};

export const getUnreadCount = async () => {
  const res = await API.get("/notifications/unread-count");
  return res.data;
};

// NOTES API

export const getNotes = async (caseId: string) =>
  unwrap(await API.get(`/cases/${caseId}/notes`));

export const addNote = async (caseId: string, text: string) =>
  unwrap(await API.post(`/cases/${caseId}/notes`, { text }));


export default API;