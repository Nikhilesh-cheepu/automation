export function isDatabaseConfigured(): boolean {
  const url =
    process.env.DATABASE_PUBLIC_URL ?? process.env.DATABASE_URL ?? "";
  return url.startsWith("postgres");
}

export function getMissingProductionEnv(): string[] {
  const missing: string[] = [];
  if (!isDatabaseConfigured()) {
    missing.push("DATABASE_URL (Railway public Postgres URL)");
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    missing.push("NEXT_PUBLIC_APP_URL (e.g. https://automations.bassik.in)");
  }
  return missing;
}
