"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Check Vercel env vars: DATABASE_URL (Railway public URL) and
        NEXT_PUBLIC_APP_URL (with https://). Then redeploy.
      </p>
      <p className="font-mono text-xs text-muted-foreground">
        {error.digest ?? error.message}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
