"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectionBadge } from "@/components/dashboard/status-badge";
import type { ConnectionStatus } from "@/lib/types";
import { Link2, Unlink } from "lucide-react";

interface ConnectRowProps {
  clientId: string;
  clientName: string;
  color: string;
  platform: "instagram" | "google";
  status: ConnectionStatus;
  accountName?: string;
  canConnect: boolean;
}

export function ConnectRow({
  clientId,
  clientName,
  color,
  platform,
  status,
  accountName,
  canConnect,
}: ConnectRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const connectHref =
    platform === "instagram"
      ? `/api/connect/meta?clientId=${clientId}`
      : `/api/connect/google?clientId=${clientId}`;

  async function disconnect() {
    setLoading(true);
    await fetch("/api/connect/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, platform }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-0">
          <span className="text-sm font-medium">{clientName}</span>
          {accountName && status === "connected" && (
            <p className="truncate text-xs text-muted-foreground">{accountName}</p>
          )}
        </div>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <ConnectionBadge status={status} />
        {status === "connected" ? (
          <Button
            size="sm"
            variant="outline"
            className="h-11 flex-1 sm:h-9 sm:flex-none"
            disabled={loading}
            onClick={disconnect}
          >
            <Unlink className="h-3.5 w-3.5" />
            Disconnect
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="h-11 flex-1 sm:h-9 sm:flex-none"
            disabled={!canConnect}
            asChild
          >
            <a href={canConnect ? connectHref : "#"}>
              <Link2 className="h-3.5 w-3.5" />
              Connect
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
