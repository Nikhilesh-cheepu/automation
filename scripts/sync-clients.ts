import "dotenv/config";
import { syncClientsFromConfig } from "../src/lib/sync-clients";
import { prisma } from "../src/lib/prisma";
import { CLIENTS } from "../src/config/clients";

async function main() {
  await syncClientsFromConfig();
  console.log(`Synced ${CLIENTS.length} client(s) from src/config/clients.ts`);
  console.log("Applied per-client secrets from .env where set.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
