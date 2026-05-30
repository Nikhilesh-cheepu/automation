/** Normalize env values (Vercel users often paste quotes from .env files). */
export function readEnv(name: string): string {
  const raw = process.env[name];
  if (!raw) return "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function getDatabaseUrl(): string {
  const publicUrl = readEnv("DATABASE_PUBLIC_URL");
  if (publicUrl.startsWith("postgres")) return publicUrl;
  const url = readEnv("DATABASE_URL");
  if (url.startsWith("postgres")) return url;
  return "";
}

export function isDatabaseConfigured(): boolean {
  return getDatabaseUrl().length > 0;
}

export function getMissingProductionEnv(): string[] {
  const missing: string[] = [];

  if (!isDatabaseConfigured()) {
    missing.push("DATABASE_URL or DATABASE_PUBLIC_URL (Railway public Postgres URL)");
  } else if (getDatabaseUrl().includes("railway.internal")) {
    missing.push(
      "DATABASE_URL uses railway.internal — change to public URL (zephyr.proxy.rlwy.net)"
    );
  }

  const appUrl = readEnv("NEXT_PUBLIC_APP_URL");
  if (!appUrl) {
    missing.push("NEXT_PUBLIC_APP_URL (https://automations.bassik.in)");
  } else if (!appUrl.startsWith("http")) {
    missing.push("NEXT_PUBLIC_APP_URL — add https:// prefix");
  }

  if (!readEnv("META_APP_ID")) missing.push("META_APP_ID");
  if (!readEnv("META_APP_SECRET")) missing.push("META_APP_SECRET");
  if (!readEnv("OPENAI_API_KEY") && !readEnv("ANTHROPIC_API_KEY")) {
    missing.push("OPENAI_API_KEY (or ANTHROPIC_API_KEY)");
  }

  return missing;
}
