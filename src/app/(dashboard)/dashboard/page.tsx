import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  ClientHealthWidget,
  InboxPreviewWidget,
  PortfolioWidget,
  QuickActions,
  StatsRow,
  TaskQueueWidget,
  TodaysPostsWidget,
} from "@/components/dashboard/widgets";
import { getClientsFromDb } from "@/lib/clients-db";
import { ensureDb } from "@/lib/ensure-db";

export default async function DashboardPage() {
  await ensureDb();
  const clients = await getClientsFromDb();
  const activeCount = clients.filter((c) => !c.isPortfolio).length;

  return (
    <DashboardShell
      title="Dashboard"
      description={`${activeCount} client${activeCount === 1 ? "" : "s"} + portfolio`}
    >
      <div className="space-y-6">
        <StatsRow clients={clients} />
        <QuickActions />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TodaysPostsWidget />
          <TaskQueueWidget />
          <InboxPreviewWidget />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <ClientHealthWidget clients={clients} />
          <PortfolioWidget clients={clients} />
        </div>
      </div>
    </DashboardShell>
  );
}
