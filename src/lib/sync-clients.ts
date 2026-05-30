import { CLIENTS, envPrefixForClient, type Platform } from "@/config/clients";
import { prisma } from "@/lib/prisma";

const PLATFORMS: Platform[] = ["instagram", "google", "whatsapp"];

function readEnv(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

/** Apply per-client tokens from .env into Connection rows. */
export async function syncSecretsFromEnv() {
  for (const client of CLIENTS) {
    const prefix = envPrefixForClient(client.id);

    const whatsappPhoneId = readEnv(`${prefix}_WHATSAPP_PHONE_NUMBER_ID`);
    const whatsappToken = readEnv(`${prefix}_WHATSAPP_ACCESS_TOKEN`);
    const whatsappWabaId = readEnv(`${prefix}_WHATSAPP_WABA_ID`);

    if (whatsappPhoneId && whatsappToken) {
      await prisma.connection.upsert({
        where: {
          clientId_platform: { clientId: client.id, platform: "whatsapp" },
        },
        create: {
          clientId: client.id,
          platform: "whatsapp",
          status: "connected",
          externalId: whatsappPhoneId,
          accountName: whatsappWabaId ? `WABA ${whatsappWabaId}` : "WhatsApp Business",
          accessToken: whatsappToken,
          metadata: JSON.stringify({
            phoneNumberId: whatsappPhoneId,
            wabaId: whatsappWabaId,
          }),
        },
        update: {
          status: "connected",
          externalId: whatsappPhoneId,
          accountName: whatsappWabaId ? `WABA ${whatsappWabaId}` : "WhatsApp Business",
          accessToken: whatsappToken,
          metadata: JSON.stringify({
            phoneNumberId: whatsappPhoneId,
            wabaId: whatsappWabaId,
          }),
        },
      });
    }

    const igToken = readEnv(`${prefix}_INSTAGRAM_ACCESS_TOKEN`);
    const igAccountId = readEnv(`${prefix}_INSTAGRAM_ACCOUNT_ID`);
    const igAccountName = readEnv(`${prefix}_INSTAGRAM_ACCOUNT_NAME`);
    const metaAppId = readEnv(`${prefix}_META_APP_ID`);
    const metaAppSecret = readEnv(`${prefix}_META_APP_SECRET`);
    const fbPageId = readEnv(`${prefix}_FB_PAGE_ID`);

    if (igToken || metaAppId || fbPageId) {
      await prisma.connection.upsert({
        where: {
          clientId_platform: { clientId: client.id, platform: "instagram" },
        },
        create: {
          clientId: client.id,
          platform: "instagram",
          status: igToken ? "connected" : "pending",
          externalId: igAccountId ?? fbPageId,
          accountName: igAccountName ?? "Instagram",
          accessToken: igToken,
          metadata: JSON.stringify({
            metaAppId,
            metaAppSecret,
            fbPageId,
            instagramAccountId: igAccountId,
          }),
        },
        update: {
          status: igToken ? "connected" : "pending",
          externalId: igAccountId ?? fbPageId,
          accountName: igAccountName ?? "Instagram",
          accessToken: igToken,
          metadata: JSON.stringify({
            metaAppId,
            metaAppSecret,
            fbPageId,
            instagramAccountId: igAccountId,
          }),
        },
      });
    }

    const googleRefresh = readEnv(`${prefix}_GOOGLE_REFRESH_TOKEN`);
    const googleAccountName = readEnv(`${prefix}_GOOGLE_ACCOUNT_NAME`);

    if (googleRefresh) {
      await prisma.connection.upsert({
        where: {
          clientId_platform: { clientId: client.id, platform: "google" },
        },
        create: {
          clientId: client.id,
          platform: "google",
          status: "connected",
          accountName: googleAccountName ?? "Google Business",
          refreshToken: googleRefresh,
        },
        update: {
          status: "connected",
          accountName: googleAccountName ?? "Google Business",
          refreshToken: googleRefresh,
        },
      });
    }
  }
}

/** Upsert all clients from src/config/clients.ts and ensure connection rows exist. */
export async function syncClientsFromConfig() {
  const configIds = new Set(CLIENTS.map((c) => c.id));

  for (const client of CLIENTS) {
    await prisma.client.upsert({
      where: { id: client.id },
      create: {
        id: client.id,
        name: client.name,
        slug: client.slug,
        color: client.color,
        isPortfolio: client.isPortfolio ?? false,
        brandVoice: client.brandVoice,
        platforms: JSON.stringify(client.platforms),
        postingFrequency: client.postingFrequency ?? "3x/week",
        calendarFillPercent: 0,
      },
      update: {
        name: client.name,
        slug: client.slug,
        color: client.color,
        isPortfolio: client.isPortfolio ?? false,
        brandVoice: client.brandVoice,
        platforms: JSON.stringify(client.platforms),
        postingFrequency: client.postingFrequency ?? "3x/week",
      },
    });

    for (const platform of client.platforms) {
      if (!PLATFORMS.includes(platform)) continue;
      await prisma.connection.upsert({
        where: {
          clientId_platform: { clientId: client.id, platform },
        },
        create: { clientId: client.id, platform, status: "disconnected" },
        update: {},
      });
    }
  }

  await prisma.client.deleteMany({
    where: { id: { notIn: [...configIds] } },
  });

  await syncSecretsFromEnv();
}
