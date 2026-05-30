"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectionBadge } from "@/components/dashboard/status-badge";
import { clientEnvKeys } from "@/lib/meta-env";
import type { ConnectionStatus } from "@/lib/types";
import { RefreshCw } from "lucide-react";

interface EnvConnectRowProps {
  clientId: string;
  clientName: string;
  color: string;
  platform: "instagram" | "google";
  status: ConnectionStatus;
  accountName?: string;
}

export function EnvConnectRow({
  clientId,
  clientName,
  color,
  platform,
  status,
  accountName,
}: EnvConnectRowProps) {
  const keys = clientEnvKeys(clientId);
  const envHint =
    platform === "instagram"
      ? `${keys.igToken}, ${keys.fbPageId}, ${keys.igAccountId}`
      : `${clientId.toUpperCase().replace(/-/g, "_")}_GOOGLE_REFRESH_TOKEN`;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
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
        <ConnectionBadge status={status} />
      </div>
      {status !== "connected" && (
        <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
          Vercel env: {envHint}
        </p>
      )}
    </div>
  );
}

export function SyncEnvButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sync() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/connect/sync-env", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setMsg("Synced from env ✓");
      router.refresh();
    } else {
      const data = await res.json();
      setMsg(data.error ?? "Sync failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="secondary" onClick={sync} disabled={loading}>
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Syncing…" : "Sync from env"}
      </Button>
      {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
    </div>
  );
}
