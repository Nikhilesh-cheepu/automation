import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { syncClientsFromConfig } from "@/lib/sync-clients";

let syncing: Promise<void> | null = null;

/** Keep DB in sync with src/config/clients.ts (dev). Production: seed only if empty. */
export async function ensureDb() {
  if (!isDatabaseConfigured()) return;

  if (process.env.NODE_ENV === "production") {
    await ensureDbOnce();
    return;
  }
  if (!syncing) {
    syncing = syncClientsFromConfig().finally(() => {
      syncing = null;
    });
  }
  await syncing;
}

export async function ensureDbOnce() {
  if (!isDatabaseConfigured()) return;
  try {
    const count = await prisma.client.count();
    if (count === 0) await syncClientsFromConfig();
  } catch {
    // DB unreachable — pages still render from config fallback
  }
}
