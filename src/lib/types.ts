export type PostStatus =
  | "idea"
  | "draft"
  | "approved"
  | "scheduled"
  | "posted";

export type PostFormat = "feed" | "story" | "reel" | "carousel";

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

export type ConnectionStatus = "connected" | "pending" | "disconnected";

export interface Client {
  id: string;
  name: string;
  slug: string;
  color: string;
  isPortfolio?: boolean;
  brandVoice?: string;
  platforms: string[];
  postingFrequency: string;
  instagramStatus: ConnectionStatus;
  googleStatus: ConnectionStatus;
  whatsappStatus: ConnectionStatus;
  lastPostDate?: string;
  calendarFillPercent: number;
  instagramAccount?: string;
  googleAccount?: string;
  whatsappAccount?: string;
}

export interface CalendarPost {
  id: string;
  clientId: string;
  title: string;
  format: PostFormat;
  scheduledAt: string;
  status: PostStatus;
  caption?: string;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  assignee: string;
  dueAt: string;
  status: TaskStatus;
}

export interface InboxItem {
  id: string;
  clientId: string;
  source: "instagram" | "google";
  author: string;
  preview: string;
  receivedAt: string;
  unread: boolean;
}
