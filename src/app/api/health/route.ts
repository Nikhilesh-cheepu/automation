import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDb = Boolean(
    process.env.DATABASE_URL?.startsWith("postgres") ||
      process.env.DATABASE_PUBLIC_URL?.startsWith("postgres")
  );
  const hasMeta = Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);

  return NextResponse.json({
    ok: true,
    hasDb,
    hasMeta,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
  });
}
