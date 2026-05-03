export const translateStatus = (status: string): string => {
  switch (status) {
    case "SUBMITTED":
      return "Inskickad";
    case "APPROVED":
      return "Godkänd";
    case "REJECTED":
      return "Avslagen";
    default:
      return status;
  }
};