/**
 * Ad account groups — one Meta ad account often serves multiple Page clients.
 * Env: AD_GROUP_{KEY}_ACCOUNT_ID=act_xxxxx
 */

export type AdAccountGroupId =
  | "club_rogue"
  | "hospitality_pack"
  | "kiik_bassik";

export interface AdAccountGroup {
  id: AdAccountGroupId;
  label: string;
  /** .env key suffix, e.g. AD_GROUP_CLUB_ROGUE_ACCOUNT_ID */
  envKey: string;
  clientIds: string[];
}

export const AD_ACCOUNT_GROUPS: AdAccountGroup[] = [
  {
    id: "club_rogue",
    label: "Club Rogue (3 locations)",
    envKey: "CLUB_ROGUE",
    clientIds: [
      "clubrogue-amb",
      "clubrogue-gachibowli",
      "clubrogue-jubilee-hills",
    ],
  },
  {
    id: "hospitality_pack",
    label: "Firefly · C53 · Boilerroom · Antervedi",
    envKey: "HOSPITALITY_PACK",
    clientIds: ["firefly", "c53", "boilerroom", "antervedi"],
  },
  {
    id: "kiik_bassik",
    label: "Kiik69 · Bassik",
    envKey: "KIIK_BASSIK",
    clientIds: ["kiik69", "bassik"],
  },
];

export function adGroupEnvKey(group: AdAccountGroup): string {
  return `AD_GROUP_${group.envKey}_ACCOUNT_ID`;
}

export function getAdGroupForClient(clientId: string): AdAccountGroup | undefined {
  return AD_ACCOUNT_GROUPS.find((g) => g.clientIds.includes(clientId));
}
