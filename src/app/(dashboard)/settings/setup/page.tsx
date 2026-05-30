import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAppUrl, getConfigStatus } from "@/lib/env";
import { ArrowLeft } from "lucide-react";

export default function SetupPage() {
  const appUrl = getAppUrl();
  const config = getConfigStatus();

  return (
    <DashboardShell
      title="Connection setup"
      description="One-time Meta & Google developer setup"
    >
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href="/settings">
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
      </Button>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. App URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Add to <code className="rounded bg-muted px-1">.env.local</code>:</p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground">
{`NEXT_PUBLIC_APP_URL=${appUrl}
DATABASE_URL="file:./prisma/dev.db"`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              2. Instagram (Meta) {config.meta ? "✓" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Create an app at{" "}
                <a
                  href="https://developers.facebook.com/apps/"
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  developers.facebook.com
                </a>
              </li>
              <li>Add product: <strong>Instagram</strong> → API setup with Facebook Login</li>
              <li>
                Valid OAuth redirect URI:
                <code className="mt-1 block rounded bg-muted px-2 py-1 text-xs text-foreground">
                  {appUrl}/api/connect/meta/callback
                </code>
              </li>
              <li>
                Permissions: instagram_basic, instagram_manage_comments,
                pages_show_list, pages_read_engagement
              </li>
            </ol>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground">
{`META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              3. Google Business Profile {config.google ? "✓" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Create OAuth credentials in{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>Enable <strong>My Business Account Management API</strong></li>
              <li>
                Redirect URI:
                <code className="mt-1 block rounded bg-muted px-2 py-1 text-xs text-foreground">
                  {appUrl}/api/connect/google/callback
                </code>
              </li>
            </ol>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground">
{`GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">4. Connect clients</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Restart <code className="rounded bg-muted px-1">npm run dev</code>,
              then go to Settings and click <strong>Connect</strong> per client.
              Each client logs in with their own Instagram / Google account.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
