import API from "./caseApi";

// Hämta alla loggar för ett specifikt case
export const getLogsByCaseId = (caseId: string) => {
  return API.get(`/cases/${caseId}/logs`);
};