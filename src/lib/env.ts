export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function isMetaConfigured() {
  return Boolean(
    process.env.META_APP_ID && process.env.META_APP_SECRET
  );
}

export function isGoogleConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}

export type ConfigStatus = {
  meta: boolean;
  google: boolean;
  anthropic: boolean;
  openai: boolean;
  higgsfield: boolean;
  nanobanana: boolean;
};

export function getConfigStatus(): ConfigStatus {
  return {
    meta: isMetaConfigured(),
    google: isGoogleConfigured(),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    higgsfield: Boolean(process.env.HIGGSFIELD_API_KEY),
    nanobanana: Boolean(process.env.NANOBANANA_API_KEY),
  };
}
