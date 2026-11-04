export const ROLES = ["citizen", "admin", "worker"] as const;
export const COMPLAINT_STATUSES = ["submitted", "under_review", "approved", "assigned", "in_progress", "resolved", "reopened", "rejected", "closed"] as const;
export const CATEGORIES = ["garbage_sanitation", "road_damage", "streetlight", "water_leakage", "drainage", "public_infrastructure", "other"] as const;
export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export const STATUS_LABELS: Record<(typeof COMPLAINT_STATUSES)[number], string> = {
  submitted: "Submitted", under_review: "Under Review", approved: "Approved", assigned: "Assigned",
  in_progress: "In Progress", resolved: "Resolved", reopened: "Reopened", rejected: "Rejected", closed: "Closed"
};
