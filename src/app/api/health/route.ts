import { NextResponse } from "next/server";
import {
  getAppUrlFromEnv,
  getDatabaseUrl,
  isDatabaseConfigured,
  readEnv,
} from "@/lib/db-status";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = getDatabaseUrl();
  const hasDb = isDatabaseConfigured();
  const hasMeta = Boolean(readEnv("META_APP_ID") && readEnv("META_APP_SECRET"));

  return NextResponse.json({
    ok: true,
    hasDb,
    hasMeta,
    appUrl: getAppUrlFromEnv(),
    dbHost: dbUrl
      ? dbUrl.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@").split("@")[1]?.split("/")[0]
      : null,
    usingDb: readEnv("DATABASE_PUBLIC_URL").startsWith("postgres")
      ? "DATABASE_PUBLIC_URL"
      : readEnv("DATABASE_URL").startsWith("postgres")
        ? "DATABASE_URL"
        : null,
  });
}
