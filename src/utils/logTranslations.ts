export const translateLog = (action: string): string => {
  if (action.startsWith("CASE_ASSIGNED_TO")) {
    const email = action.split("CASE_ASSIGNED_TO")[1]?.trim();
    return email
      ? `Tilldelat ${email}`
      : "Tilldelat handläggare";
  }

  if (action === "CASE_CREATED") {
    return "Ärende skapat";
  }

  if (action === "STATUS_CHANGED_APPROVED") {
    return "Godkänt";
  }

  if (action === "STATUS_CHANGED_REJECTED") {
    return "Avslaget";
  }

  if (action === "CASE_APPEALED") {
    return "Överklagat";
  }

  return formatFallback(action);
};

const formatFallback = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
};