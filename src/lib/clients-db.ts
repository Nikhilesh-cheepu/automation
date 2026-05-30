import { prisma } from "@/lib/prisma";
import { CLIENTS } from "@/config/clients";
import { isDatabaseConfigured } from "@/lib/db-status";
import type { Client } from "@/lib/types";

const PLATFORMS_WITH_CONNECTION = ["instagram", "google", "whatsapp"] as const;

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function getClientsFromDb(): Promise<Client[]> {
  if (!isDatabaseConfigured()) {
    return getClientsFromConfig();
  }

  try {
    const rows = await prisma.client.findMany({
      orderBy: [{ isPortfolio: "desc" }, { name: "asc" }],
      include: { connections: true },
    });

    if (rows.length === 0) return getClientsFromConfig();
    return rows.map(mapClientRow);
  } catch {
    return getClientsFromConfig();
  }
}

function getClientsFromConfig(): Client[] {
  return CLIENTS.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    color: c.color,
    isPortfolio: c.isPortfolio,
    brandVoice: c.brandVoice,
    platforms: c.platforms,
    postingFrequency: c.postingFrequency ?? "3x/week",
    instagramStatus: "disconnected" as const,
    googleStatus: "disconnected" as const,
    whatsappStatus: "disconnected" as const,
    calendarFillPercent: 0,
  }));
}

function mapConnectionStatus(status: string): Client["instagramStatus"] {
  if (status === "connected") return "connected";
  if (status === "pending") return "pending";
  return "disconnected";
}

function mapClientRow(row: {
  id: string;
  name: string;
  slug: string;
  color: string;
  isPortfolio: boolean;
  brandVoice: string | null;
  platforms: string;
  postingFrequency: string;
  calendarFillPercent: number;
  lastPostDate: string | null;
  connections: Array<{
    platform: string;
    status: string;
    accountName: string | null;
  }>;
}): Client {
  const platforms = JSON.parse(row.platforms) as string[];
  const ig = row.connections.find((c) => c.platform === "instagram");
  const google = row.connections.find((c) => c.platform === "google");
  const whatsapp = row.connections.find((c) => c.platform === "whatsapp");

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    color: row.color,
    isPortfolio: row.isPortfolio,
    brandVoice: row.brandVoice ?? undefined,
    platforms,
    postingFrequency: row.postingFrequency,
    instagramStatus: ig ? mapConnectionStatus(ig.status) : "disconnected",
    googleStatus: google ? mapConnectionStatus(google.status) : "disconnected",
    whatsappStatus: whatsapp ? mapConnectionStatus(whatsapp.status) : "disconnected",
    lastPostDate: row.lastPostDate ?? undefined,
    calendarFillPercent: row.calendarFillPercent,
    instagramAccount: ig?.accountName ?? undefined,
    googleAccount: google?.accountName ?? undefined,
    whatsappAccount: whatsapp?.accountName ?? undefined,
  };
}

export type ClientWithAccounts = Client;

export interface CreateClientInput {
  name: string;
  brandVoice?: string;
  platforms: string[];
  postingFrequency?: string;
  color?: string;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const slug = slugify(input.name);
  const id = slug || `client-${Date.now()}`;

  const existing = await prisma.client.findUnique({ where: { id } });
  if (existing) {
    throw new Error("A client with this name already exists");
  }

  const row = await prisma.client.create({
    data: {
      id,
      name: input.name.trim(),
      slug,
      color: input.color ?? "#6366f1",
      brandVoice: input.brandVoice?.trim() || null,
      platforms: JSON.stringify(input.platforms),
      postingFrequency: input.postingFrequency ?? "3x/week",
      calendarFillPercent: 0,
    },
    include: { connections: true },
  });

  for (const platform of input.platforms) {
    if (
      PLATFORMS_WITH_CONNECTION.includes(
        platform as (typeof PLATFORMS_WITH_CONNECTION)[number]
      )
    ) {
      await prisma.connection.create({
        data: { clientId: row.id, platform, status: "disconnected" },
      });
    }
  }

  const refreshed = await prisma.client.findUnique({
    where: { id: row.id },
    include: { connections: true },
  });

  if (!refreshed) throw new Error("Failed to create client");
  return mapClientRow(refreshed);
}
