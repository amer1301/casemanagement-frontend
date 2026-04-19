export type Case = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  applicantName: string;
  personalNumber: string;
  category: string;
  priority?: number;
  assignedToName?: string;
  rejectionReason?: string;
  appealed?: boolean;
  appealReason?: string;
  type: "ROLE_REQUEST" | "NORMAL";
};