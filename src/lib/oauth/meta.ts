import { getAppUrl } from "@/lib/env";

const META_SCOPES = [
  "instagram_basic",
  "instagram_manage_comments",
  "pages_show_list",
  "pages_read_engagement",
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

export async function getInstagramBusinessAccount(userAccessToken: string) {
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=${userAccessToken}`
  );
  const pagesData = (await pagesRes.json()) as {
    data?: Array<{
      id: string;
      name: string;
      instagram_business_account?: { id: string };
    }>;
    error?: { message: string };
  };

  if (pagesData.error) {
    throw new Error(pagesData.error.message);
  }

  const pageWithIg = pagesData.data?.find((p) => p.instagram_business_account);
  if (!pageWithIg?.instagram_business_account) {
    throw new Error(
      "No Instagram Business account found. Link IG to a Facebook Page first."
    );
  }

  const igId = pageWithIg.instagram_business_account.id;
  const igRes = await fetch(
    `https://graph.facebook.com/v21.0/${igId}?fields=id,username,name&access_token=${userAccessToken}`
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
    accessToken: userAccessToken,
  };
}
