export interface Notification {
  id: string;
  type: "review" | "task" | "message" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  status?: "accepted" | "pending_approval" | "declined_rejected";
  declineReason?: string;
  rejectionReason?: string;
  newDueDate?: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
