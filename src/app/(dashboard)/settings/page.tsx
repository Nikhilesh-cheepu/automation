import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { getClientsFromDb } from "@/lib/clients-db";
import { getConfigStatus } from "@/lib/env";
import { ensureDb } from "@/lib/ensure-db";

export default async function SettingsPage() {
  await ensureDb();
  const clients = await getClientsFromDb();
  const config = getConfigStatus();

  return (
    <DashboardShell
      title="Settings"
      description="Connect Instagram & Google · API keys"
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <SettingsPanel clients={clients} config={config} />
      </Suspense>
    </DashboardShell>
  );
}
