import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ContentBatchPanel } from "@/components/ai/content-batch-panel";
import { getClientsFromDb } from "@/lib/clients-db";
import { getConfigStatus } from "@/lib/env";
import { ensureDb } from "@/lib/ensure-db";

export default async function ContentBatchPage() {
  await ensureDb();
  const clients = await getClientsFromDb();
  const config = getConfigStatus();

  return (
    <DashboardShell title="Content batch" description="AI Brain — weekly posts per client">
      <ContentBatchPanel
        clients={clients}
        hasAiKey={config.anthropic || config.openai}
      />
    </DashboardShell>
  );
}
