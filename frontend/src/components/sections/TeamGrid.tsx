"use client";

import { useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { Tilt } from "@/components/anim/Tilt";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { TeamProfileModal } from "@/components/sections/TeamProfileModal";
import { TeamPhoto } from "@/components/ui/TeamPhoto";
import type { TeamMemberView } from "@/lib/content-mappers";
import { getProfileCardPreview } from "@/lib/team-profiles";
import { groupTeamMembers, type TeamTier } from "@/lib/team-data";

type TeamGridProps = {
  members: TeamMemberView[];
  variant?: "default" | "about";
};

const tierLabels: Record<TeamTier, string> = {
  founder: "Founders",
  manager: "Leadership",
  employee: "Our Team",
};

function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function TeamCard({
  member,
  index,
  variant,
  onSelect,
}: {
  member: TeamMemberView;
  index: number;
  variant: "default" | "about";
  onSelect: (member: TeamMemberView) => void;
}) {
  const cardClass =
    variant === "about" ? "team-card team-card--about team-card--clickable" : "team-card team-card--clickable";
  const preview = getProfileCardPreview(member.name, member.role);

  return (
    <Reveal delay={0.05 + index * 0.05}>
      <Tilt className={cardClass}>
        <button
          type="button"
          className="team-card__trigger"
          onClick={() => onSelect(member)}
          aria-label={`View profile for ${member.name}`}
        >
          <div className="team-card__frame">
            {member.photoAsset ? (
              <CloudinaryImage
                asset={member.photoAsset}
                alt={member.name}
                width={600}
                height={800}
                transformWidth={960}
                className="team-card__photo"
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 360px"
                priority={member.tier === "founder" && index === 0}
              />
            ) : member.photo ? (
              <TeamPhoto
                src={member.photo}
                alt={member.name}
                className="team-card__photo"
                priority={member.tier === "founder" && index === 0}
              />
            ) : (
              <div className="team-card__avatar" aria-hidden>
                <span>{memberInitials(member.name)}</span>
                <div className="team-card__avatar-glow" />
              </div>
            )}
            {member.tier === "founder" ? (
              <span className="team-card__badge team-card__badge--founder">Founder</span>
            ) : member.tier === "manager" ? (
              <span className="team-card__badge team-card__badge--manager">Manager</span>
            ) : null}
            <span className="team-card__view">View profile</span>
          </div>
          <div className="team-card__meta">
            <h3>{member.name}</h3>
            <span className="team-card__role">{member.role}</span>
            <span className="team-card__education">{preview.education}</span>
            {preview.skills.length > 0 ? (
              <div className="team-card__tags" aria-label="Skills">
                {preview.skills.map((skill) => (
                  <span key={skill} className="team-card__tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <span className="team-card__summary">{preview.summary}</span>
            )}
          </div>
        </button>
      </Tilt>
    </Reveal>
  );
}

export function TeamGrid({ members, variant = "default" }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMemberView | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const groups = groupTeamMembers(members);

  function openProfile(member: TeamMemberView) {
    setSelectedMember(member);
    setModalOpen(true);
  }

  function closeProfile() {
    setModalOpen(false);
    window.setTimeout(() => setSelectedMember(null), 320);
  }

  return (
    <div className={`team-grid${variant === "about" ? " team-grid--about" : ""}`}>
      {groups.map((group) => (
        <section key={group.tier} className="team-grid__group" aria-label={group.label}>
          <header className="team-grid__head">
            <span className="team-grid__eyebrow">{tierLabels[group.tier]}</span>
            <h3 className="team-grid__title">{group.label}</h3>
          </header>
          <div
            className={`team-grid__cards ${
              group.tier === "founder"
                ? "team-grid__cards--founders"
                : group.tier === "manager"
                  ? "team-grid__cards--manager"
                  : "team-grid__cards--employees"
            }`}
          >
            {group.members.map((member, index) => (
              <TeamCard
                key={`${member.name}-${member.role}`}
                member={member}
                index={index}
                variant={variant}
                onSelect={openProfile}
              />
            ))}
          </div>
        </section>
      ))}

      <TeamProfileModal
        member={selectedMember}
        open={modalOpen}
        onClose={closeProfile}
      />
    </div>
  );
}
