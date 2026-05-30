import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ensureDb } from "@/lib/ensure-db";

export default async function TasksPage() {
  await ensureDb();

  return (
    <DashboardShell title="Tasks" description="Team assignments">
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No tasks yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Tasks will sync from your team workflow in the next update.
          </p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/clients">Add clients first</Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
