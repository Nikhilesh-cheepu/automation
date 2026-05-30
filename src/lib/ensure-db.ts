import { prisma } from "@/lib/prisma";
import { syncClientsFromConfig } from "@/lib/sync-clients";

let syncing: Promise<void> | null = null;

/** Keep DB in sync with src/config/clients.ts (dev). Production: seed only if empty. */
export async function ensureDb() {
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
  const count = await prisma.client.count();
  if (count === 0) await syncClientsFromConfig();
}
