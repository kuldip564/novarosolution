import type { DbTeamMember } from "./content";
import { team } from "./site-data";

export const LEGACY_TEAM_NAMES = new Set([
  "Founder / CEO",
  "Engineering Lead",
  "AI Lead",
  "Growth Lead",
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
  if (members.some((member) => LEGACY_TEAM_NAMES.has(member.name))) {
    return teamAsDbMembers();
  }
  return members;
}
