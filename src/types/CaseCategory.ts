export type CaseCategory =
  | "STUDY"
  | "HOUSING"
  | "SICKNESS_BENEFIT"
  | "PARENTAL_LEAVE"
  | "UNEMPLOYMENT_SUPPORT";

export const caseCategoryLabels: Record<CaseCategory, string> = {
  STUDY: "Studiemedel",
  HOUSING: "Bostadsbidrag",
  SICKNESS_BENEFIT: "Sjukpenning",
  PARENTAL_LEAVE: "Föräldrapenning",
  UNEMPLOYMENT_SUPPORT: "Arbetslöshetsstöd",
};