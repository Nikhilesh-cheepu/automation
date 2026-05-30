import { Badge } from "@/components/ui/badge";
import type { ConnectionStatus, PostStatus, TaskStatus } from "@/lib/types";

const postLabels: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  approved: "Approved",
  scheduled: "Scheduled",
  posted: "Posted",
};

const postVariant: Record<
  PostStatus,
  "default" | "secondary" | "success" | "warning" | "outline"
> = {
  idea: "outline",
  draft: "secondary",
  approved: "default",
  scheduled: "warning",
  posted: "success",
};

export function PostStatusBadge({ status }: { status: PostStatus }) {
  return <Badge variant={postVariant[status]}>{postLabels[status]}</Badge>;
}

const taskVariant: Record<
  TaskStatus,
  "default" | "secondary" | "success" | "warning" | "destructive" | "outline"
> = {
  todo: "outline",
  in_progress: "default",
  done: "success",
  blocked: "destructive",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const labels: Record<TaskStatus, string> = {
    todo: "To do",
    in_progress: "In progress",
    done: "Done",
    blocked: "Blocked",
  };
  return <Badge variant={taskVariant[status]}>{labels[status]}</Badge>;
}

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const map: Record<ConnectionStatus, { label: string; variant: "success" | "warning" | "outline" }> = {
    connected: { label: "Connected", variant: "success" },
    pending: { label: "Connect", variant: "warning" },
    disconnected: { label: "Off", variant: "outline" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
