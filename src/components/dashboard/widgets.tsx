import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Camera,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectionBadge } from "@/components/dashboard/status-badge";
import type { Client } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <Button className="h-11 w-full sm:h-9 sm:w-auto" size="sm" variant="secondary" asChild>
          <Link href="/clients">
            <Plus className="h-4 w-4" />
            Clients
          </Link>
        </Button>
        <Button className="h-11 w-full sm:h-9 sm:w-auto" size="sm" variant="secondary" asChild>
          <Link href="/google-seo">
            <Sparkles className="h-4 w-4" />
            Google SEO
          </Link>
        </Button>
        <Button className="h-11 w-full sm:h-9 sm:w-auto" size="sm" variant="outline" asChild>
          <Link href="/ai-studio/content-batch">
            <Sparkles className="h-4 w-4" />
            AI content
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function TodaysPostsWidget() {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Today&apos;s posts</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/calendar">
            Calendar <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No posts scheduled yet. Add clients, then create posts in Calendar.
        </p>
      </CardContent>
    </Card>
  );
}

export function TaskQueueWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Task queue</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      </CardContent>
    </Card>
  );
}

export function ClientHealthWidget({ clients }: { clients: Client[] }) {
  const active = clients.filter((c) => !c.isPortfolio);

  if (active.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Clients are defined in <code className="rounded bg-muted px-1">src/config/clients.ts</code>.
            Run <code className="rounded bg-muted px-1">npm run db:sync</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Client health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:hidden">
        {active.map((client) => (
          <div key={client.id} className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: client.color }}
              />
              <span className="font-medium">{client.name}</span>
            </div>
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
          </div>
        ))}
      </CardContent>
      <CardContent className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Client</th>
                <th className="pb-2 pr-4 font-medium">Instagram</th>
                <th className="pb-2 pr-4 font-medium">Google</th>
                <th className="pb-2 font-medium">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {active.map((client) => (
                <tr key={client.id} className="border-b border-border/50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: client.color }}
                      />
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {client.platforms.includes("instagram") ? (
                      <ConnectionBadge status={client.instagramStatus} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {client.platforms.includes("google") ? (
                      <ConnectionBadge status={client.googleStatus} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3">
                    {client.platforms.includes("whatsapp") ? (
                      <ConnectionBadge status={client.whatsappStatus} />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioWidget({ clients }: { clients: Client[] }) {
  const portfolio = clients.find((c) => c.isPortfolio);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="h-4 w-4 text-primary" />
          Portfolio
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ai-studio">Generate</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {portfolio ? (
          <div className="rounded-lg border border-border p-3 text-sm">
            <p className="font-medium">{portfolio.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {portfolio.instagramStatus === "connected"
                ? "Instagram connected"
                : "Connect Instagram in Settings"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Portfolio not set up.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function InboxPreviewWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-8 text-center">
          <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Connect accounts first</p>
          <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
            Comments, reviews, and DMs appear here after connection
          </p>
          <Button className="mt-4" size="sm" variant="secondary" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsRow({ clients }: { clients: Client[] }) {
  const active = clients.filter((c) => !c.isPortfolio);
  const igDisconnected = active.filter(
    (c) => c.platforms.includes("instagram") && c.instagramStatus !== "connected"
  ).length;

  const stats = [
    { label: "Posts today", value: 0, icon: Calendar },
    { label: "Active clients", value: active.length, icon: Sparkles },
    { label: "IG to connect", value: igDisconnected, icon: Camera },
    { label: "Overdue tasks", value: 0, icon: AlertCircle },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {s.label}
              </p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </Card>
        );
      })}
    </div>
  );
}
