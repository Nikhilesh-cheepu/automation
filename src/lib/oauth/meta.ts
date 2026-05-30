import { getAppUrl } from "@/lib/env";
import { getClientById } from "@/config/clients";

const META_SCOPES = [
  "instagram_basic",
  "instagram_manage_comments",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_metadata",
  "business_management",
].join(",");

export function getMetaAuthUrl(clientId: string) {
  const appId = process.env.META_APP_ID!;
  const redirectUri = `${getAppUrl()}/api/connect/meta/callback`;
  const state = Buffer.from(JSON.stringify({ clientId })).toString("base64url");

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: META_SCOPES,
    response_type: "code",
    state,
  });

  return `https://www.facebook.com/v21.0/dialog/oauth?${params}`;
}

export function parseMetaState(state: string): { clientId: string } | null {
  try {
    return JSON.parse(Buffer.from(state, "base64url").toString()) as {
      clientId: string;
    };
  } catch {
    return null;
  }
}

export async function exchangeMetaCode(code: string) {
  const redirectUri = `${getAppUrl()}/api/connect/meta/callback`;
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${params}`
  );
  const data = (await res.json()) as {
    access_token?: string;
    error?: { message: string };
  };
  if (!data.access_token) {
    throw new Error(data.error?.message ?? "Failed to get Meta access token");
  }
  return data.access_token;
}

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scorePageMatch(
  pageName: string,
  clientName: string,
  facebookPageName?: string
): number {
  const page = normalizeName(pageName);
  const name = normalizeName(clientName);
  const fb = facebookPageName ? normalizeName(facebookPageName) : "";

  if (fb && page === fb) return 100;
  if (fb && (page.includes(fb) || fb.includes(page))) return 80;
  if (page.includes(name) || name.includes(page)) return 60;
  return 0;
}

type PageRow = {
  id: string;
  name: string;
  access_token?: string;
  instagram_business_account?: { id: string };
};

function pickPageForClient(pages: PageRow[], clientId: string): PageRow {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Unknown client: ${clientId}`);
  }

  const withIg = pages.filter((p) => p.instagram_business_account);
  if (withIg.length === 0) {
    throw new Error(
      "No Instagram Business account found. Link IG to a Facebook Page first."
    );
  }

  const ranked = withIg
    .map((p) => ({
      page: p,
      score: scorePageMatch(p.name, client.name, client.facebookPageName),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score === 0) {
    const hint = client.facebookPageName ?? client.name;
    throw new Error(
      `Could not match Facebook Page for ${client.name}. Expected something like "${hint}". Meta returned: ${withIg.map((p) => p.name).join(", ")}`
    );
  }

  return best.page;
}

export async function getInstagramBusinessAccount(
  userAccessToken: string,
  clientId: string
) {
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${userAccessToken}`
  );
  const pagesData = (await pagesRes.json()) as {
    data?: PageRow[];
    error?: { message: string };
  };

  if (pagesData.error) {
    throw new Error(pagesData.error.message);
  }

  const pageWithIg = pickPageForClient(pagesData.data ?? [], clientId);
  const igId = pageWithIg.instagram_business_account!.id;
  const pageToken = pageWithIg.access_token ?? userAccessToken;

  const igRes = await fetch(
    `https://graph.facebook.com/v21.0/${igId}?fields=id,username,name&access_token=${pageToken}`
  );
  const igData = (await igRes.json()) as {
    id: string;
    username?: string;
    name?: string;
    error?: { message: string };
  };

  if (igData.error) throw new Error(igData.error.message);

  return {
    pageId: pageWithIg.id,
    pageName: pageWithIg.name,
    igId: igData.id,
    igUsername: igData.username ?? igData.name ?? igData.id,
    accessToken: pageToken,
  };
}
