export const translateCategory = (category?: string): string => {
  switch (category) {
    case "SICKNESS_BENEFIT":
      return "Sjukpenning";

    case "PARENTAL_LEAVE":
      return "Föräldraledighet";

    case "STUDY":
      return "Studier";

    case "HOUSING":
      return "Bostad";

    case "UNEMPLOYMENT_SUPPORT":
      return "Arbetslöshetsstöd";

    default:
      return category ?? "Okänd";
  }
};