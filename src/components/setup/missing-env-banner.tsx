import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMissingProductionEnv } from "@/lib/db-status";

export function MissingEnvBanner() {
  const missing = getMissingProductionEnv();
  if (missing.length === 0) return null;

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-destructive">
          Server not configured — add env vars on Vercel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          The site deployed but these environment variables are missing on Vercel
          (Settings → Environment Variables → Production):
        </p>
        <ul className="list-inside list-disc space-y-1 font-mono text-xs text-foreground">
          {missing.map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
        <p>
          <strong>Both DB URLs OK:</strong> set{" "}
          <code className="rounded bg-muted px-1">DATABASE_PUBLIC_URL</code> (public, for Vercel) and{" "}
          <code className="rounded bg-muted px-1">DATABASE_URL</code> (internal, for Railway). App
          uses public on Vercel automatically.
        </p>
      </CardContent>
    </Card>
  );
}
