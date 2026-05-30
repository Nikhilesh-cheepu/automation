/** Normalize env values (Vercel users often paste quotes from .env files). */
export function readEnv(name: string): string {
  const raw = process.env[name];
  if (!raw) return "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

/** Accept automations.bassik.in or https://automations.bassik.in */
export function normalizeAppUrl(raw: string): string {
  const v = raw.trim().replace(/^["']|["']$/g, "");
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

export function getAppUrlFromEnv(): string {
  const custom = readEnv("NEXT_PUBLIC_APP_URL");
  if (custom) return normalizeAppUrl(custom);
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Supports both Railway URLs:
 * - DATABASE_PUBLIC_URL → used on Vercel (zephyr.proxy.rlwy.net)
 * - DATABASE_URL → internal or public; skipped on Vercel if .internal only
 */
export function getDatabaseUrl(): string {
  const publicUrl = readEnv("DATABASE_PUBLIC_URL");
  const primaryUrl = readEnv("DATABASE_URL");
  const onVercel = Boolean(process.env.VERCEL);

  if (publicUrl.startsWith("postgres")) return publicUrl;

  if (primaryUrl.startsWith("postgres")) {
    if (onVercel && primaryUrl.includes("railway.internal")) {
      return "";
    }
    return primaryUrl;
  }

  return "";
}

export function isDatabaseConfigured(): boolean {
  return getDatabaseUrl().length > 0;
}

export function getMissingProductionEnv(): string[] {
  const missing: string[] = [];

  if (!isDatabaseConfigured()) {
    missing.push(
      "DATABASE_PUBLIC_URL (Railway public URL) or DATABASE_URL — set at least one on Vercel Production, then Redeploy"
    );
  }

  if (!readEnv("NEXT_PUBLIC_APP_URL") && !process.env.VERCEL_URL) {
    missing.push("NEXT_PUBLIC_APP_URL (e.g. automations.bassik.in or https://automations.bassik.in)");
  }

  if (!readEnv("META_APP_ID")) missing.push("META_APP_ID");
  if (!readEnv("META_APP_SECRET")) missing.push("META_APP_SECRET");
  if (!readEnv("OPENAI_API_KEY") && !readEnv("ANTHROPIC_API_KEY")) {
    missing.push("OPENAI_API_KEY (or ANTHROPIC_API_KEY)");
  }

  return missing;
}
