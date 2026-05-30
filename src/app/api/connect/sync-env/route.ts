import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db-status";
import { syncSecretsFromEnv } from "@/lib/sync-clients";

export const dynamic = "force-dynamic";

/** Pull Instagram / WhatsApp / Google tokens from env into DB. */
export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured on server" },
      { status: 503 }
    );
  }

  try {
    await syncSecretsFromEnv();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
