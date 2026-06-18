import type { DbProject, DbService, DbTeamMember } from "./content";
import type { CloudinaryAsset } from "./media";
import { cloudinaryTransformUrl, parseCloudinaryAsset, resolveAssetUrl } from "./media";
import {
  homeProjects as fallbackHomeProjects,
  serviceDetails as fallbackServiceDetails,
  services as fallbackServices,
  team as fallbackTeam,
  workProjects as fallbackWorkProjects,
} from "./site-data";
import { getWorkProjectImages, mergeWorkProjectImages } from "./work-project-images";
import { LEGACY_TEAM_NAMES } from "./team-defaults";

export type WorkProjectView = {
  idx: string;
  slug: string;
  category: string;
  title: string;
  hook: string;
  heroTitle: string;
  story: string;
  externalUrl?: string | null;
  heroImage?: CloudinaryAsset | null;
  screens: CloudinaryAsset[];
  coverClass: string;
  results: ReadonlyArray<{ value: string; label: string } | string>;
  tags: readonly string[] | string[];
};

export type ServiceRowView = {
  no: string;
  title: string;
  description: string;
  bullets: readonly string[] | string[];
  mediaTitle: string;
  mediaHint: string;
  imageAlt?: string;
  imageAsset?: CloudinaryAsset | null;
  media?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type HomeProjectView = {
  href: string;
  category: string;
  title: string;
  description: string;
  cover: string;
  imageAsset?: CloudinaryAsset | null;
};

export type ServiceGridView = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[] | string[];
  icon: string;
  imageAsset?: CloudinaryAsset | null;
};

export type TeamMemberView = {
  name: string;
  role: string;
  photo?: string | null;
  photoAsset?: CloudinaryAsset | null;
};

export function mapDbProjectsToWork(projects: DbProject[]): WorkProjectView[] {
  if (!projects.length) {
    return fallbackWorkProjects.map((project, index) => {
      const images = getWorkProjectImages(project.slug);
      return {
        ...project,
        idx: String(index + 1).padStart(2, "0"),
        slug: project.slug,
        externalUrl: project.externalUrl,
        heroImage: images?.hero ?? null,
        screens: images?.screens ?? [],
        coverClass: `c${(index % 4) + 1}`,
      };
    });
  }
  return projects.map((project, index) => {
    const screens = Array.isArray(project.screens)
      ? project.screens
          .map((item) => parseCloudinaryAsset(item))
          .filter((asset): asset is CloudinaryAsset => Boolean(asset?.secureUrl))
      : [];
    const merged = mergeWorkProjectImages(
      project.slug,
      parseCloudinaryAsset(project.heroImage),
      screens,
    );

    return {
      idx: String(index + 1).padStart(2, "0"),
      slug: project.slug,
      category: project.category,
      title: project.title,
      hook: project.hook,
      heroTitle: project.heroTitle ?? `Project hero — ${project.title}`,
      story: project.body,
      externalUrl: project.externalUrl,
      heroImage: merged.heroImage,
      screens: merged.screens,
      coverClass: project.coverClass ?? "c1",
      results: (project.results as WorkProjectView["results"]) ?? [],
      tags: project.tags ?? [],
    };
  });
}

export function mapDbProjectsToHomeGrid(projects: DbProject[]): HomeProjectView[] {
  if (!projects.length) return [...fallbackHomeProjects];
  return projects.slice(0, 4).map((project) => {
    const merged = mergeWorkProjectImages(
      project.slug,
      parseCloudinaryAsset(project.heroImage),
      Array.isArray(project.screens)
        ? project.screens
            .map((item) => parseCloudinaryAsset(item))
            .filter((asset): asset is CloudinaryAsset => Boolean(asset?.secureUrl))
        : [],
    );

    return {
      href: project.externalUrl ?? "/work",
      category: project.category,
      title: project.title,
      description: project.hook,
      cover: project.coverClass ?? "c1",
      imageAsset: merged.heroImage ?? merged.screens[0] ?? null,
    };
  });
}

export function mapDbServicesToRows(services: DbService[]): ServiceRowView[] {
  if (!services.length) return [...fallbackServiceDetails];
  return services.map((service, index) => {
    const imageAsset = parseCloudinaryAsset(service.image);
    const url = resolveAssetUrl(service.image);
    return {
      no: String(index + 1).padStart(2, "0"),
      title: service.title,
      description: service.description,
      bullets: service.bullets ?? [],
      mediaTitle: `${service.title} work`,
      mediaHint: "Add image / video · 4:3",
      imageAlt: service.imageAlt ?? service.title,
      imageAsset,
      media: url
        ? {
            src:
              cloudinaryTransformUrl(imageAsset ?? service.image, {
                width: 1200,
                crop: "fill",
              }) ?? url,
            alt: service.imageAlt ?? service.title,
            width: 2048,
            height: 1529,
          }
        : undefined,
    };
  });
}

export function mapDbServicesToGrid(services: DbService[]): ServiceGridView[] {
  if (!services.length) {
    return fallbackServices.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      tags: service.tags,
      icon: service.icon,
    }));
  }

  return services.map((service, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title: service.title,
    description: service.shortDescription ?? service.description,
    tags: service.tags ?? [],
    icon: service.icon ?? "monitor",
    imageAsset: parseCloudinaryAsset(service.image),
  }));
}

export function mapDbTeam(members: DbTeamMember[]): TeamMemberView[] {
  if (!members.length) return [...fallbackTeam];
  if (members.some((member) => LEGACY_TEAM_NAMES.has(member.name))) {
    return [...fallbackTeam];
  }
  return members.map((member) => {
    const photoAsset = parseCloudinaryAsset(member.photo);
    return {
      name: member.name,
      role: member.role,
      photo: resolveAssetUrl(member.photo) ?? null,
      photoAsset,
    };
  });
}
