import {
  teamPhotoBySlugGenerated as syncedTeamPhotos,
  teamPhotosSynced,
} from "./team-photos.generated";

export function teamMemberSlug(name: string): string {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
}

/** Local team headshots synced from /img → /public/images/team/ */
export const teamPhotoBySlug: Record<string, string> = {
  ...syncedTeamPhotos,
};

export function localTeamPhoto(name: string): string | null {
  const slug = teamMemberSlug(name);
  return teamPhotoBySlug[slug] ?? null;
}

export const teamPhotosAvailable = teamPhotosSynced;
