import type { DbTeamMember } from "./content";
import { canonicalTeamNames, isCanonicalTeam, team } from "./team-data";

export const LEGACY_TEAM_NAMES = new Set([
  "Founder / CEO",
  "Engineering Lead",
  "AI Lead",
  "Growth Lead",
  "Piyush Chaudhary",
]);

export function teamAsDbMembers(): DbTeamMember[] {
  return team.map((member, index) => ({
    id: `default-team-${index}`,
    name: member.name,
    role: member.role,
    photo: null,
    order: index,
    published: true,
  }));
}

export function resolvePublishedTeam(members: DbTeamMember[]): DbTeamMember[] {
  if (!members.length) return teamAsDbMembers();

  const names = members.map((member) => member.name);

  if (members.some((member) => LEGACY_TEAM_NAMES.has(member.name))) {
    return teamAsDbMembers();
  }

  if (!isCanonicalTeam(names)) {
    return teamAsDbMembers();
  }

  return members
    .filter((member) => canonicalTeamNames.has(member.name))
    .sort((a, b) => a.order - b.order)
    .map((member) => {
      const canonical = team.find((entry) => entry.name === member.name);
      if (!canonical) return member;
      return { ...member, role: canonical.role };
    });
}
