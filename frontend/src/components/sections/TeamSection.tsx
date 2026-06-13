import { ClipReveal } from "@/components/anim/ClipReveal";
import { Reveal } from "@/components/anim/Reveal";
import { Tilt } from "@/components/anim/Tilt";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import { team as fallbackTeam } from "@/lib/site-data";
import type { TeamMemberView } from "@/lib/content-mappers";

type TeamSectionProps = {
  members?: TeamMemberView[];
};

export function TeamSection({ members = [...fallbackTeam] }: TeamSectionProps) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <span className="eyebrow">The team</span>
            <h2>The people behind the work.</h2>
            <p>
              Drop in real headshots and names — these cards are ready for them.
            </p>
          </Reveal>
        </div>

        <div className="team">
          {members.map((member) => (
            <Reveal key={`${member.name}-${member.role}`}>
              <Tilt className="member">
                <ClipReveal>
                  {member.photoAsset ? (
                    <CloudinaryImage
                      asset={member.photoAsset}
                      alt={member.name}
                      width={600}
                      height={800}
                      transformWidth={480}
                      className="member-ph member-photo"
                      sizes="(max-width: 768px) 50vw, 240px"
                    />
                  ) : member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt={member.name} className="member-ph member-photo" />
                  ) : (
                    <MediaPlaceholder
                      title="Photo"
                      hint="3:4 portrait"
                      className="member-ph"
                    />
                  )}
                </ClipReveal>
                <div className="b">
                  <h4>{member.name}</h4>
                  <span>{member.role}</span>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
