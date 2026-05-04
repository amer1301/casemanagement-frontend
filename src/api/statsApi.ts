import api from "./caseApi";

/**
 * Hämtar övergripande dashboard-statistik
 */
export const getDashboardStats = async () => {
  const res = await api.get("/cases/dashboard");
  return res.data.data;
};

/**
 * Hämtar statistik per admin (endast MANAGER)
 */
export const getAdminStats = async () => {
  const res = await api.get("/reports/admin-stats");
  return res.data;
};

export const downloadMonthlyReport = async () => {
  const res = await api.get("/reports/monthly", {
    responseType: "blob",
  });


 const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "monthly-report.csv");
  document.body.appendChild(link);
  link.click();
};