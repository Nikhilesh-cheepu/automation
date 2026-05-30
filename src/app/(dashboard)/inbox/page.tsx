import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function InboxPage() {
  return (
    <DashboardShell
      title="Inbox"
      description="Instagram comments + Google reviews — Phase 2 & 3"
    >
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex gap-4">
            <div className="rounded-full bg-muted p-4">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="rounded-full bg-muted p-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-lg font-semibold">Unified inbox coming in Phase 2</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            See all Instagram comments and Google reviews in one list. AI drafts
            replies — you edit and approve before sending.
          </p>
          <ul className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
            <li>· Filter by client (7 accounts)</li>
            <li>· AI reply draft (Claude / OpenAI)</li>
            <li>· Approve & Send to Instagram / Google</li>
          </ul>
          <Button className="mt-8" asChild>
            <Link href="/settings">Configure connections</Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
