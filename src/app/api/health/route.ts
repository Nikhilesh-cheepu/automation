import { NextResponse } from "next/server";
import {
  getDatabaseUrl,
  isDatabaseConfigured,
  readEnv,
} from "@/lib/db-status";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = getDatabaseUrl();
  const hasDb = isDatabaseConfigured();
  const hasMeta = Boolean(readEnv("META_APP_ID") && readEnv("META_APP_SECRET"));
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL") || null;

  return NextResponse.json({
    ok: true,
    hasDb,
    hasMeta,
    appUrl,
    dbHost: dbUrl
      ? dbUrl.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@").split("/")[2]?.split("@")[1]
      : null,
    hint: !hasDb
      ? "Set DATABASE_URL on Vercel (Production), no quotes, then Redeploy"
      : dbUrl.includes("railway.internal")
        ? "Use public Railway URL (zephyr.proxy.rlwy.net), not railway.internal"
        : null,
  });
}
