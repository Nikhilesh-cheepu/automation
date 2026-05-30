/**
 * Source of truth for all clients.
 * One Facebook Page (+ IG + WhatsApp) per client row.
 * Ad accounts are shared via src/config/ad-accounts.ts — not 1:1 with clients.
 *
 * After edits: npm run db:sync
 * Secrets: .env per client — see .env.example
 */

import type { AdAccountGroupId } from "@/config/ad-accounts";

export type Platform = "instagram" | "google" | "whatsapp";

export interface ClientDefinition {
  id: string;
  name: string;
  slug: string;
  color: string;
  isPortfolio?: boolean;
  /** Facebook Page name (from Meta switcher) — for your reference when filling IDs */
  facebookPageName?: string;
  brandVoice: string;
  platforms: Platform[];
  postingFrequency?: string;
  businessType?: string;
  location?: string;
  /** Primary ad account group for this client */
  adAccountGroup?: AdAccountGroupId;
  /** Sometimes you run ads from another group's account (e.g. Bassik → hospitality pack) */
  alternateAdAccountGroups?: AdAccountGroupId[];
}

export const CLIENTS: ClientDefinition[] = [
  {
    id: "portfolio",
    name: "PORTFOLIO (You)",
    slug: "portfolio",
    color: "#8b5cf6",
    isPortfolio: true,
    brandVoice:
      "Professional, educational, behind-the-scenes social media growth tips.",
    platforms: ["instagram"],
    postingFrequency: "3x/week",
    businessType: "social media agency",
    location: "Hyderabad",
  },

  // --- Club Rogue (1 ad account → 3 Pages) ---
  {
    id: "clubrogue-amb",
    name: "Club Rogue AMB",
    slug: "clubrogue-amb",
    color: "#a855f7",
    facebookPageName: "Club Rogue AMB Tollywood",
    brandVoice:
      "High-energy nightclub. Tollywood nights, premium crowd, bold visuals, event-led captions.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "nightclub",
    location: "AMB, Hyderabad",
    adAccountGroup: "club_rogue",
  },
  {
    id: "clubrogue-gachibowli",
    name: "Club Rogue Gachibowli",
    slug: "clubrogue-gachibowli",
    color: "#9333ea",
    facebookPageName: "Club Rogue Gachibowli Bollywood & Tollywood",
    brandVoice:
      "Bollywood & Tollywood club nights. Hype reels, DJ drops, weekend plans, youthful tone.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "nightclub",
    location: "Gachibowli, Hyderabad",
    adAccountGroup: "club_rogue",
  },
  {
    id: "clubrogue-jubilee-hills",
    name: "Club Rogue Jubilee Hills",
    slug: "clubrogue-jubilee-hills",
    color: "#7c3aed",
    facebookPageName: "Club Rogue Jubilee Hills Tollywood & Bollywood",
    brandVoice:
      "Upscale Jubilee Hills nightlife. Premium events, guest lists, polished but fun copy.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "nightclub",
    location: "Jubilee Hills, Hyderabad",
    adAccountGroup: "club_rogue",
  },

  // --- Hospitality pack (1 ad account → 4 Pages) ---
  {
    id: "firefly",
    name: "Firefly",
    slug: "firefly",
    color: "#f59e0b",
    facebookPageName: "Fireflyclub.hyd",
    brandVoice:
      "Vibrant club & lounge. Warm, inviting, weekend energy, Hyderabad local crowd.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "club",
    location: "Hyderabad",
    adAccountGroup: "hospitality_pack",
  },
  {
    id: "c53",
    name: "C53",
    slug: "c53",
    color: "#eab308",
    facebookPageName: "C53 ads",
    brandVoice:
      "Urban hub / mall venue. Events, food, nightlife mix — punchy offers and footfall CTAs.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "restaurant / nightlife hub",
    location: "Hyderabad",
    adAccountGroup: "hospitality_pack",
  },
  {
    id: "boilerroom",
    name: "Boilerroom",
    slug: "boilerroom",
    color: "#ca8a04",
    facebookPageName: "Boilerroom ads",
    brandVoice:
      "Industrial-chic bar energy. Raw, bold, music-forward, sports and party crossover.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "sports bar / club",
    location: "Hyderabad",
    adAccountGroup: "hospitality_pack",
  },
  {
    id: "antervedi",
    name: "Antervedi",
    slug: "antervedi",
    color: "#d97706",
    brandVoice:
      "Distinct venue identity — match brand guidelines when provided. Local Hyderabad audience.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "4x/week",
    businessType: "hospitality",
    location: "Hyderabad",
    adAccountGroup: "hospitality_pack",
  },

  // --- Kiik69 + Bassik (1 ad account → 2 Pages) ---
  {
    id: "kiik69",
    name: "Kiik69 Sports Bar",
    slug: "kiik69",
    color: "#ef4444",
    facebookPageName: "KiiK 69 Sports Bar",
    brandVoice:
      "Energetic sports bar. Big screens, match-day hype, cold drinks, friendly local crowd.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "5x/week",
    businessType: "sports bar",
    location: "Hyderabad",
    adAccountGroup: "kiik_bassik",
  },
  {
    id: "bassik",
    name: "Bassik",
    slug: "bassik",
    color: "#0ea5e9",
    facebookPageName: "Bassik Hospitality Services Pvt Ltd",
    brandVoice:
      "Hospitality group / Bassik.in — professional, brand-forward, multi-venue credibility.",
    platforms: ["instagram", "google", "whatsapp"],
    postingFrequency: "4x/week",
    businessType: "hospitality group",
    location: "Hyderabad",
    adAccountGroup: "kiik_bassik",
    alternateAdAccountGroups: ["hospitality_pack"],
  },
];

export function getClientById(id: string): ClientDefinition | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getPayingClients(): ClientDefinition[] {
  return CLIENTS.filter((c) => !c.isPortfolio);
}

export function envPrefixForClient(clientId: string): string {
  return clientId.toUpperCase().replace(/-/g, "_");
}
