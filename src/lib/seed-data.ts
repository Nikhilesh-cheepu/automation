import { syncClientsFromConfig } from "@/lib/sync-clients";

/** Sync clients from src/config/clients.ts + secrets from .env */
export async function seedDatabase() {
  await syncClientsFromConfig();
}
