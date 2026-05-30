"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConnectionBadge } from "@/components/dashboard/status-badge";
import type { ConnectionStatus } from "@/lib/types";
import { MessageCircle } from "lucide-react";

interface WhatsAppConnectRowProps {
  clientId: string;
  clientName: string;
  color: string;
  status: ConnectionStatus;
  accountName?: string;
}

export function WhatsAppConnectRow({
  clientId,
  clientName,
  color,
  status,
  accountName,
}: WhatsAppConnectRowProps) {
  const [open, setOpen] = useState(false);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setLoading(true);
    const res = await fetch("/api/connect/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        phoneNumberId,
        wabaId,
        accessToken,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      setOpen(false);
      window.location.reload();
    } else {
      const data = await res.json();
      alert(data.error ?? "Failed to save");
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div>
            <span className="text-sm font-medium">{clientName}</span>
            {accountName && status === "connected" && (
              <p className="text-xs text-muted-foreground">{accountName}</p>
            )}
          </div>
        </div>
        <ConnectionBadge status={status} />
      </div>

      {status !== "connected" && (
        <>
          {!open ? (
            <Button
              variant="secondary"
              className="h-11 w-full"
              onClick={() => setOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Add WhatsApp Business API
            </Button>
          ) : (
            <div className="space-y-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                From Meta Developer → WhatsApp → API Setup. One compartment per client.
              </p>
              <div className="space-y-2">
                <Label>Phone Number ID</Label>
                <Input
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="From WhatsApp API Setup"
                />
              </div>
              <div className="space-y-2">
                <Label>WABA ID (optional)</Label>
                <Input
                  value={wabaId}
                  onChange={(e) => setWabaId(e.target.value)}
                  placeholder="WhatsApp Business Account ID"
                />
              </div>
              <div className="space-y-2">
                <Label>Permanent access token</Label>
                <Input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="From Meta system user / token"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="h-11 flex-1"
                  onClick={save}
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Save connection"}
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {saved && (
        <p className="text-xs text-emerald-600">WhatsApp saved for this client.</p>
      )}
    </div>
  );
}
