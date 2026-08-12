"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { TeamPhoto } from "@/components/ui/TeamPhoto";
import type { TeamMemberView } from "@/lib/content-mappers";
import { resolveTeamProfile, type TeamProfile } from "@/lib/team-profiles";

type TeamProfileModalProps = {
  member: TeamMemberView | null;
  open: boolean;
  onClose: () => void;
};

const tierLabels = {
  founder: "Co-Founder",
  manager: "Leadership",
  employee: "Team Member",
} as const;

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ProfilePhoto({ member }: { member: TeamMemberView }) {
  if (member.photoAsset) {
    return (
      <CloudinaryImage
        asset={member.photoAsset}
        alt={member.name}
        width={800}
        height={1067}
        transformWidth={1200}
        className="team-profile__photo"
        sizes="(max-width: 720px) 80vw, 400px"
        priority
      />
    );
  }

  if (member.photo) {
    return (
      <TeamPhoto
        src={member.photo}
        alt={member.name}
        className="team-profile__photo"
        variant="modal"
        priority
      />
    );
  }

  const initials = member.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="team-profile__avatar" aria-hidden>
      <span>{initials}</span>
    </div>
  );
}

function ProfileFact({
  icon: Icon,
  label,
  children,
  wide,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`team-profile__fact${wide ? " team-profile__fact--wide" : ""}`}>
      <div className="team-profile__fact-head">
        <span className="team-profile__fact-icon" aria-hidden>
          <Icon size={14} strokeWidth={2.25} />
        </span>
        <span className="team-profile__fact-label">{label}</span>
      </div>
      <div className="team-profile__fact-value">{children}</div>
    </div>
  );
}

function ProfileSection({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="team-profile__section team-profile__section--card" aria-labelledby={id}>
      <div className="team-profile__section-head">
        {Icon ? (
          <span className="team-profile__section-icon" aria-hidden>
            <Icon size={15} strokeWidth={2.25} />
          </span>
        ) : null}
        <h3 id={id}>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ProfileBody({ profile }: { profile: TeamProfile }) {
  return (
    <div className="team-profile__body">
      <div className="team-profile__intro">
        <span className={`team-profile__tier team-profile__tier--${profile.tier}`}>
          {tierLabels[profile.tier]}
        </span>
        <h2 id="team-profile-title" className="team-profile__name">
          {profile.name}
        </h2>
        <p className="team-profile__role">{profile.role}</p>
        <p className="team-profile__summary">{profile.summary}</p>
        <p className="team-profile__bio">{profile.bio}</p>
      </div>

      <div className="team-profile__facts team-profile__facts--full" aria-label="Profile details">
        <ProfileFact icon={MapPin} label="Location">
          {profile.location}
        </ProfileFact>
        <ProfileFact icon={Building2} label="Department">
          {profile.department}
        </ProfileFact>
        <ProfileFact icon={Calendar} label="At Novaro">
          {profile.joined}
        </ProfileFact>
        <ProfileFact icon={Briefcase} label="Experience">
          {profile.experience}
        </ProfileFact>
        <ProfileFact icon={GraduationCap} label="Education" wide={!profile.graduation}>
          {profile.education}
        </ProfileFact>
        {profile.graduation ? (
          <ProfileFact icon={GraduationCap} label="Graduation">
            {profile.graduation}
          </ProfileFact>
        ) : null}
        {profile.age != null ? (
          <ProfileFact icon={User} label="Age">
            {profile.age} years
          </ProfileFact>
        ) : null}
        {profile.phone ? (
          <ProfileFact icon={Phone} label="Mobile">
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
          </ProfileFact>
        ) : null}
        {profile.email ? (
          <ProfileFact icon={Mail} label="Email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </ProfileFact>
        ) : null}
      </div>

      <ProfileSection id="team-profile-focus" title="Focus areas" icon={Sparkles}>
        <ul>
          {profile.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ProfileSection>

      <ProfileSection id="team-profile-skills" title="Skills" icon={Briefcase}>
        <div className="team-profile__skills">
          {profile.skills.map((skill) => (
            <span key={skill} className="team-profile__skill">
              {skill}
            </span>
          ))}
        </div>
      </ProfileSection>

      <ProfileSection id="team-profile-interests" title="Interests" icon={Heart}>
        <div className="team-profile__skills">
          {profile.interests.map((item) => (
            <span key={item} className="team-profile__skill team-profile__skill--soft">
              {item}
            </span>
          ))}
        </div>
      </ProfileSection>

      <ProfileSection id="team-profile-highlights" title="Highlights" icon={Award}>
        <ul>
          {profile.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ProfileSection>

      <p className="team-profile__member-note">
        Part of Novaro Solution — Gandhinagar, Gujarat · Serving clients across India.
      </p>
    </div>
  );
}

export function TeamProfileModal({ member, open, onClose }: TeamProfileModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const profile = member ? resolveTeamProfile(member) : null;

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      trapFocus(event);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, trapFocus]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="wait">
      {open && member && profile ? (
        <motion.div
          key={member.name}
          className="team-profile-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            className="team-profile-modal"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-profile-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 0.84, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="team-profile__close"
              aria-label="Close profile"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="team-profile__layout">
              <div className="team-profile__visual">
                <ProfilePhoto member={member} />
                <p className="team-profile__visual-name">{profile.name}</p>
                <p className="team-profile__visual-caption">{profile.role}</p>
                <span className={`team-profile__visual-tier team-profile__tier--${profile.tier}`}>
                  {tierLabels[profile.tier]}
                </span>
                {profile.phone || profile.email ? (
                  <div className="team-profile__visual-contact">
                    {profile.phone ? (
                      <a href={`tel:${profile.phone.replace(/\s/g, "")}`} aria-label="Call">
                        <Phone size={15} strokeWidth={2.25} />
                        <span>Call</span>
                      </a>
                    ) : null}
                    {profile.email ? (
                      <a href={`mailto:${profile.email}`} aria-label="Email">
                        <Mail size={15} strokeWidth={2.25} />
                        <span>Email</span>
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <ProfileBody profile={profile} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
