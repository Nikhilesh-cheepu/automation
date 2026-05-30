import { DashboardShell } from "@/components/layout/dashboard-shell";
import { GoogleSeoPanel } from "@/components/ai/google-seo-panel";
import { getClientsFromDb } from "@/lib/clients-db";
import { getConfigStatus } from "@/lib/env";
import { ensureDb } from "@/lib/ensure-db";

export default async function GoogleSeoPage() {
  await ensureDb();
  const clients = await getClientsFromDb();
  const config = getConfigStatus();

  return (
    <DashboardShell
      title="Google SEO"
      description="AI suggestions for Business Profile"
    >
      <GoogleSeoPanel
        clients={clients}
        hasAiKey={config.anthropic || config.openai}
      />
    </DashboardShell>
  );
}
