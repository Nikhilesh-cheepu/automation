import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function resolveDatabaseUrl() {
  // Railway: use public proxy locally; internal host only works on Railway network
  if (process.env.DATABASE_PUBLIC_URL) return process.env.DATABASE_PUBLIC_URL;
  return process.env.DATABASE_URL ?? "file:./prisma/dev.db";
}

function createPrismaClient() {
  const url = resolveDatabaseUrl();

  if (url.startsWith("postgres")) {
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
