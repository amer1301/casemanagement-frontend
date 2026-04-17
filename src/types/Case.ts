export type Case = {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    assignedToName?: string;
    rejectionReason?: string;
    appealed?: boolean;
appealReason?: string;
type: "ROLE_REQUEST" | "NORMAL";
};
