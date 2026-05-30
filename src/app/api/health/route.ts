import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db-status";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDb = isDatabaseConfigured();
  const hasMeta = Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);

  return NextResponse.json({
    ok: true,
    hasDb,
    hasMeta,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
  });
}
