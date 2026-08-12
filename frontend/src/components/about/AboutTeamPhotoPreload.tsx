import { teamPhotoBySlugGenerated } from "@/lib/team-photos.generated";

/** Preload synced team headshots on the about page for faster first paint */
export function AboutTeamPhotoPreload() {
  const preload = Object.values(teamPhotoBySlugGenerated);

  return (
    <>
      {preload.map((href) => (
        <link key={href} rel="preload" as="image" href={href} />
      ))}
    </>
  );
}
