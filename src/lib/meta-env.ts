import { AD_ACCOUNT_GROUPS, adGroupEnvKey } from "@/config/ad-accounts";
import { readEnv } from "@/lib/db-status";

/** Ad account IDs from Vercel env (act_xxxxx). */
export function getAdAccountIdForGroup(envKey: string): string | undefined {
  return readEnv(`AD_GROUP_${envKey}_ACCOUNT_ID`) || undefined;
}

export function getAdAccountsFromEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const group of AD_ACCOUNT_GROUPS) {
    const id = getAdAccountIdForGroup(group.envKey);
    if (id) out[group.id] = id;
  }
  return out;
}

/** Env prefix cheat sheet for Settings UI. */
export function clientEnvKeys(clientId: string) {
  const p = clientId.toUpperCase().replace(/-/g, "_");
  return {
    prefix: p,
    fbPageId: `${p}_FB_PAGE_ID`,
    igAccountId: `${p}_INSTAGRAM_ACCOUNT_ID`,
    igAccountName: `${p}_INSTAGRAM_ACCOUNT_NAME`,
    igToken: `${p}_INSTAGRAM_ACCESS_TOKEN`,
    waPhone: `${p}_WHATSAPP_PHONE_NUMBER_ID`,
    waToken: `${p}_WHATSAPP_ACCESS_TOKEN`,
  };
}
