import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectionBadge } from "@/components/dashboard/status-badge";
import { getClientsFromDb } from "@/lib/clients-db";
import { ensureDb } from "@/lib/ensure-db";
import { CLIENTS } from "@/config/clients";

export default async function ClientsPage() {
  await ensureDb();
  const clients = await getClientsFromDb();

  return (
    <DashboardShell
      title="Clients"
      description="Defined in code · synced to database on load"
    >
      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <p className="font-medium">Code-first clients (local dev)</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            Edit <code className="rounded bg-muted px-1">src/config/clients.ts</code> to add or update clients
          </li>
          <li>
            Put secrets in <code className="rounded bg-muted px-1">.env</code> — see{" "}
            <code className="rounded bg-muted px-1">.env.example</code>
          </li>
          <li>
            Run <code className="rounded bg-muted px-1">npm run db:sync</code> or restart dev — DB updates automatically
          </li>
          <li>
            Dashboard = scheduling & automations view · not where clients are created
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {CLIENTS.length} client(s) in config · {clients.length} in database
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {clients.map((client) => (
          <Card
            key={client.id}
            className={client.isPortfolio ? "ring-1 ring-primary/40" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: client.color }}
                  />
                  <CardTitle className="text-base">{client.name}</CardTitle>
                </div>
                {client.isPortfolio && (
                  <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    PORTFOLIO
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                id: <code>{client.slug}</code>
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="line-clamp-3 text-muted-foreground">
                {client.brandVoice ?? "No brand voice in config."}
              </p>
              <div className="flex flex-wrap gap-2">
                {client.platforms.includes("instagram") && (
                  <ConnectionBadge status={client.instagramStatus} />
                )}
                {client.platforms.includes("google") && (
                  <ConnectionBadge status={client.googleStatus} />
                )}
                {client.platforms.includes("whatsapp") && (
                  <ConnectionBadge status={client.whatsappStatus} />
                )}
              </div>
              <Button variant="outline" size="sm" className="h-11 w-full sm:h-9" asChild>
                <Link href="/settings">Connection status</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
