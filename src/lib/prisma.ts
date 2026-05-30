import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function resolveDatabaseUrl(): string | null {
  if (process.env.DATABASE_PUBLIC_URL) return process.env.DATABASE_PUBLIC_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return null;
}

function createPostgresClient(url: string): PrismaClient {
  const pool = new Pool({
    connectionString: url,
    ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false },
    connectionTimeoutMillis: 15_000,
    max: 5,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function createSqliteClient(url: string): PrismaClient {
  // Dev only — avoid bundling native better-sqlite3 on Vercel
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl();

  if (url?.startsWith("postgres")) {
    return createPostgresClient(url);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL (or DATABASE_PUBLIC_URL) must be set to a Postgres URL in production."
    );
  }

  return createSqliteClient(url ?? "file:./prisma/dev.db");
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

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
