import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function resolveDatabaseUrl(): string | null {
  if (process.env.DATABASE_PUBLIC_URL) return process.env.DATABASE_PUBLIC_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return null;
}

function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl();

  if (url?.startsWith("postgres")) {
    const pool = new Pool({
      connectionString: url,
      ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL (or DATABASE_PUBLIC_URL) must be set to a Postgres URL in production."
    );
  }

  const sqliteUrl = url ?? "file:./prisma/dev.db";
  const adapter = new PrismaBetterSqlite3({ url: sqliteUrl });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/** Lazy client — avoids connecting during Vercel build when env is injected at runtime. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
