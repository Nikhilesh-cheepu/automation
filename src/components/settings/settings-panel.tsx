"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectRow } from "@/components/settings/connect-buttons";
import { EnvConnectRow, SyncEnvButton } from "@/components/settings/env-connect-row";
import type { ClientWithAccounts } from "@/lib/clients-db";
import type { ConfigStatus } from "@/lib/env";
import { Key, Camera, Building2, ExternalLink, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { WhatsAppConnectRow } from "@/components/settings/whatsapp-connect";

const ERROR_MESSAGES: Record<string, string> = {
  meta_not_configured:
    "Add META_APP_ID and META_APP_SECRET to .env.local first.",
  google_not_configured:
    "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local first.",
  meta_denied: "Instagram connection was cancelled.",
  google_denied: "Google connection was cancelled.",
  meta_failed: "Instagram connection failed.",
  google_failed: "Google connection failed.",
};

interface SettingsPanelProps {
  clients: ClientWithAccounts[];
  config: ConfigStatus;
}

export function SettingsPanel({ clients, config }: SettingsPanelProps) {
  const searchParams = useSearchParams();
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    const detail = searchParams.get("detail");
    const account = searchParams.get("account");

    if (connected === "instagram") {
      setBanner({
        type: "success",
        message: `Instagram connected${account ? `: @${account}` : ""}`,
      });
    } else if (connected === "google") {
      setBanner({ type: "success", message: "Google Business Profile connected" });
    } else if (error) {
      setBanner({
        type: "error",
        message:
          (ERROR_MESSAGES[error] ?? error) + (detail ? ` — ${detail}` : ""),
      });
    }
  }, [searchParams]);

  const apiKeys = [
    { name: "Anthropic (Claude)", env: "ANTHROPIC_API_KEY", ok: config.anthropic, phase: "1b" },
    { name: "OpenAI", env: "OPENAI_API_KEY", ok: config.openai, phase: "1b" },
    { name: "Higgsfield", env: "HIGGSFIELD_API_KEY", ok: config.higgsfield, phase: "1c" },
    { name: "Nanobanana", env: "NANOBANANA_API_KEY", ok: config.nanobanana, phase: "1c" },
  ];

  const igClients = clients.filter((c) => c.platforms.includes("instagram"));
  const googleClients = clients.filter((c) => c.platforms.includes("google"));
  const waClients = clients.filter((c) => c.platforms.includes("whatsapp"));

  return (
    <div className="grid w-full max-w-3xl gap-4 sm:gap-6">
      {banner && (
        <div
          className={`flex items-start gap-2 rounded-lg border p-4 text-sm ${
            banner.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {banner.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {banner.message}
        </div>
      )}

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium">Connect via Vercel env (recommended)</p>
          <p className="text-sm text-muted-foreground">
            OAuth scopes are blocked by Meta right now. Add tokens in{" "}
            <strong>Vercel → Environment Variables</strong>, then click Sync.
          </p>
          <SyncEnvButton />
          <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
            <li>
              Meta →{" "}
              <a
                href="https://developers.facebook.com/tools/explorer/"
                className="text-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                Graph API Explorer
              </a>{" "}
              → app Social Media OS
            </li>
            <li>Generate token with: pages_show_list, pages_read_engagement</li>
            <li>
              Run query:{" "}
              <code className="rounded bg-muted px-1">GET me/accounts?fields=id,name,access_token,instagram_business_account</code>
            </li>
            <li>Copy Page access_token + instagram id for each client → Vercel env</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4" />
            AI API keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Add keys to <code className="rounded bg-muted px-1">.env.local</code>{" "}
            and restart the dev server.
          </p>
          {apiKeys.map((key) => (
            <div
              key={key.env}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">{key.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {key.env}
                </p>
              </div>
              <span
                className={`text-xs font-medium ${key.ok ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                {key.ok ? "Configured" : `Phase ${key.phase}`}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="h-4 w-4" />
            Instagram
            {!config.meta && (
              <span className="text-xs font-normal text-amber-600">
                — Meta app not configured
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="mb-3 text-sm text-muted-foreground">
            Per client — add to Vercel env, then Sync from env above.
          </p>
          {igClients.filter((c) => !c.isPortfolio).map((client) => (
            <EnvConnectRow
              key={`${client.id}-ig`}
              clientId={client.id}
              clientName={client.name}
              color={client.color}
              platform="instagram"
              status={client.instagramStatus}
              accountName={client.instagramAccount}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            Google Business Profile
            {!config.google && (
              <span className="text-xs font-normal text-amber-600">
                — Google OAuth not configured
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {googleClients.filter((c) => !c.isPortfolio).map((client) => (
            <EnvConnectRow
              key={`${client.id}-google`}
              clientId={client.id}
              clientName={client.name}
              color={client.color}
              platform="google"
              status={client.googleStatus}
              accountName={client.googleAccount}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-4 w-4" />
            WhatsApp Business
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="mb-3 text-sm text-muted-foreground">
            Same Meta app can power WhatsApp. Each client gets their own API credentials (compartment).
          </p>
          {waClients.map((client) => (
            <WhatsAppConnectRow
              key={`${client.id}-wa`}
              clientId={client.id}
              clientName={client.name}
              color={client.color}
              status={client.whatsappStatus}
              accountName={client.whatsappAccount}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
