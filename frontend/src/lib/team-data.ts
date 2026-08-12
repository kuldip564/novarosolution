export type TeamTier = "founder" | "manager" | "employee";

export type TeamMember = {
  name: string;
  role: string;
  tier: TeamTier;
};

export type TeamMemberDisplay = {
  name: string;
  role: string;
  tier: TeamTier;
};

export const team: TeamMember[] = [
  { name: "Kuldip Chaudhary", role: "Co-Founder · Engineering", tier: "founder" },
  { name: "Mehul Chaudhary", role: "Co-Founder · Food Safety & Quality Assurance", tier: "founder" },
  { name: "Ronak Prajapati", role: "Co-Founder · Technology", tier: "founder" },
  { name: "Alpesh Prajapati", role: "Manager · Operations & Delivery", tier: "manager" },
  { name: "Maulik Chaudhary", role: "Software Developer", tier: "employee" },
  { name: "Krina Patel", role: "Python Developer", tier: "employee" },
  { name: "Sonal Chaudhary", role: "Digital Marketing Specialist", tier: "employee" },
  { name: "Abhi Joshi", role: "Finance & Business Automation", tier: "employee" },
];

export const teamCount = team.length;

export const canonicalTeamNames = new Set(team.map((member) => member.name));

const tierOrder: TeamTier[] = ["founder", "manager", "employee"];

const groupLabels: Record<TeamTier, string> = {
  founder: "The minds behind Novaro",
  manager: "Keeping delivery on track",
  employee: "Engineers, designers & marketers who ship",
};

export function inferTeamTier(role: string): TeamTier {
  const normalized = role.toLowerCase();
  if (normalized.includes("founder") || normalized.includes("co-founder")) {
    return "founder";
  }
  if (normalized.includes("manager") || normalized.includes("lead")) {
    return "manager";
  }
  return "employee";
}

export function resolveMemberTier(name: string, role: string): TeamTier {
  const match = team.find((member) => member.name === name);
  if (match) return match.tier;
  return inferTeamTier(role);
}

/** Prefer canonical role from team-data.ts when the member is known */
export function resolveCanonicalRole(name: string, role: string): string {
  const match = team.find((member) => member.name === name);
  return match?.role ?? role;
}

export function groupTeamMembers(members: TeamMemberDisplay[]) {
  return tierOrder
    .map((tier) => ({
      tier,
      label: groupLabels[tier],
      members: members.filter((member) => member.tier === tier),
    }))
    .filter((group) => group.members.length > 0);
}

export function isCanonicalTeam(names: string[]): boolean {
  if (names.length !== team.length) return false;
  return team.every((member) => names.includes(member.name));
}
