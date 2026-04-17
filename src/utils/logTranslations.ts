export const translateLog = (action: string, username?: string): string => {
  switch (action) {

    case "CASE_CREATED":
      return "Ärende skapat";

    case "CASE_UPDATED":
      return "Ärende uppdaterat";

    case "CASE_DELETED":
      return "Ärende raderat";

    case "CASE_ASSIGNED_TO":
      return username
        ? `Tilldelat till ${username}`
        : "Tilldelat handläggare";

    case "CASE_REASSIGNED":
      return username
        ? `Omtilldelat till ${username}`
        : "Omtilldelat ärende";

    case "STATUS_CHANGED_APPROVED":
      return "Godkänt";

    case "STATUS_CHANGED_REJECTED":
      return "Avslaget";

    case "CASE_APPEALED":
      return "Överklagat";

    case "ROLE_REQUEST_CREATED":
      return "Ansökan om admin skapad";

    case "USER_PROMOTED_TO_ADMIN":
      return "Användare blev admin";

    case "ADMIN_REQUEST_REJECTED":
      return "Adminansökan avslogs";

    default:
      return formatFallback(action);
  }
};

const formatFallback = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
};