import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientsFromDb } from "@/lib/clients-db";
import { ensureDb } from "@/lib/ensure-db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CalendarPage() {
  await ensureDb();
  const clients = await getClientsFromDb();

  return (
    <DashboardShell
      title="Content calendar"
      description="Pipeline: idea → draft → approved → scheduled → posted"
    >
      <div className="space-y-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: client.color }}
                />
                {client.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No posts yet. Use AI Studio to generate content, then add scheduling here (next update).
              </p>
            </CardContent>
          </Card>
        ))}
        {clients.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Add a client first.</p>
              <Button className="mt-4" asChild>
                <Link href="/clients">Go to Clients</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
