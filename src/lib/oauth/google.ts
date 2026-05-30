import { getAppUrl } from "@/lib/env";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/business.manage",
].join(" ");

export function getGoogleAuthUrl(clientId: string) {
  const redirectUri = `${getAppUrl()}/api/connect/google/callback`;
  const state = Buffer.from(JSON.stringify({ clientId })).toString("base64url");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function parseGoogleState(state: string): { clientId: string } | null {
  try {
    return JSON.parse(Buffer.from(state, "base64url").toString()) as {
      clientId: string;
    };
  } catch {
    return null;
  }
}

export async function exchangeGoogleCode(code: string) {
  const redirectUri = `${getAppUrl()}/api/connect/google/callback`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    throw new Error(data.error_description ?? data.error ?? "Google token failed");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

export async function getGoogleAccountName(accessToken: string) {
  const res = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = (await res.json()) as {
    accounts?: Array<{ name: string; accountName?: string }>;
    error?: { message: string };
  };

  if (data.error) throw new Error(data.error.message);
  const first = data.accounts?.[0];
  return first?.accountName ?? first?.name ?? "Google Business";
}
