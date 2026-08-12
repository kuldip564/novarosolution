import { Reveal } from "@/components/anim/Reveal";
import type { TeamMemberView } from "@/lib/content-mappers";
import { mapDbTeam } from "@/lib/content-mappers";
import { TeamGrid } from "@/components/sections/TeamGrid";

type TeamSectionProps = {
  members?: TeamMemberView[];
};

export function TeamSection({ members = mapDbTeam([]) }: TeamSectionProps) {
  return (
    <section className="sec team-sec">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <span className="eyebrow">Our people</span>
            <h2>Founders, leaders &amp; the team that ships.</h2>
            <p>
              Co-founders Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati
              started Novaro in Gandhinagar. Alpesh Prajapati leads operations and
              client delivery — backed by engineers, designers, and marketers who
              build every project end to end.
            </p>
          </Reveal>
        </div>

        <TeamGrid members={members} />
      </div>
    </section>
  );
}
