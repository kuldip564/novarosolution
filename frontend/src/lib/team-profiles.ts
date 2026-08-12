import type { TeamMemberView } from "./content-mappers";
import { resolveCanonicalRole, resolveMemberTier, team, type TeamTier } from "./team-data";

export type TeamProfile = {
  name: string;
  role: string;
  tier: TeamTier;
  summary: string;
  bio: string;
  department: string;
  experience: string;
  focus: string[];
  skills: string[];
  highlights: string[];
  location: string;
  joined: string;
  age?: number;
  education: string;
  graduation?: string;
  phone?: string;
  email?: string;
  interests: string[];
};

/** Full profile content keyed by canonical member name — keep in sync with `team` in team-data.ts */
export const teamProfiles: Record<string, TeamProfile> = {
  "Kuldip Chaudhary": {
    name: "Kuldip Chaudhary",
    role: "Co-Founder · Engineering",
    tier: "founder",
    summary: "Co-founder leading engineering, architecture & delivery quality at Novaro.",
    bio: "Kuldip co-founded Novaro Solution in Gandhinagar to build software the way product teams actually need it — typed, tested, and ready for real users. He leads engineering architecture, code quality, and the technical direction behind every client delivery from MVP to scale.",
    department: "Engineering & Product",
    experience: "Co-founder · 2+ years shipping production software",
    focus: [
      "System architecture & technical leadership",
      "Next.js / Node production stacks",
      "Engineering standards, code review & delivery quality",
      "Client technical roadmaps & founder collaboration",
    ],
    skills: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "System design",
      "DevOps",
      "MongoDB",
      "API design",
    ],
    highlights: [
      "Sets engineering standards across all Novaro projects",
      "Hands-on with architecture from MVP through scale",
      "Works directly with founders on technical roadmaps",
      "Leads the Gandhinagar engineering studio day to day",
    ],
    location: "Gandhinagar, Gujarat, India",
    joined: "Co-founder · 2024",
    education: "Computer Science & Software Engineering",
    interests: ["System design", "Product engineering", "DevOps", "Open source"],
  },
  "Mehul Chaudhary": {
    name: "Mehul Chaudhary",
    role: "Co-Founder · Food Safety & Quality Assurance",
    tier: "founder",
    summary: "Co-founder · Food Safety & QA professional — Australian food manufacturing.",
    bio: "Food Safety and Quality Assurance professional with experience in the Australian food manufacturing industry, specialising in food safety, quality systems, regulatory compliance, and continuous improvement. Mehul enjoys solving production and quality challenges using data, improving processes, and working closely with production teams to build a strong food safety culture.",
    department: "Food Safety & Quality Assurance",
    experience: "Co-founder · 5+ years in Australian food manufacturing QA",
    focus: [
      "SQF certification & HACCP food safety systems",
      "Internal audits, GMP & regulatory compliance (FSANZ)",
      "Root cause analysis, CAPA & customer complaint investigations",
      "SOP development, staff training & process validation",
      "Supplier quality, specifications & label compliance",
    ],
    skills: [
      "Food Safety & Quality Assurance",
      "SQF & HACCP Systems",
      "Internal Audits & GMP",
      "FSANZ Compliance",
      "Root Cause Analysis & CAPA",
      "Microbiological Testing",
      "Supplier Quality Assurance",
      "Continuous Improvement",
    ],
    highlights: [
      "Experience across SQF certification, HACCP, and internal audit programs",
      "Led environmental monitoring & microbiological testing programs",
      "Developed SOPs, conducted staff training & validated manufacturing processes",
      "Ensured compliance with Australian food regulations & FSANZ standards",
    ],
    location: "Australia · Food Manufacturing Industry",
    joined: "Co-founder · Novaro Solution",
    education: "Food Safety, Quality Systems & Regulatory Compliance (Australia)",
    interests: [
      "Continuous improvement",
      "Food safety culture",
      "Data-driven quality decisions",
      "Operational excellence",
    ],
  },
  "Ronak Prajapati": {
    name: "Ronak Prajapati",
    role: "Co-Founder · Technology",
    tier: "founder",
    summary: "Co-founder driving AI/ML strategy, tech roadmap & platform scalability.",
    bio: "Ronak drives Novaro's technology vision — evaluating stacks, guiding AI/ML initiatives, and making sure every build is future-proof. He stays close to emerging tools so clients get modern solutions, not legacy debt, and mentors the engineering team on production-ready practices.",
    department: "Technology & Innovation",
    experience: "Co-founder · AI/ML & cloud architecture leadership",
    focus: [
      "Technology roadmap & innovation strategy",
      "AI/ML integration & intelligent features",
      "Platform scalability, performance & cloud architecture",
      "Stack evaluation & technical due diligence",
    ],
    skills: [
      "AI/ML",
      "Cloud architecture",
      "React",
      "Python",
      "Data pipelines",
      "LLM applications",
      "System scalability",
    ],
    highlights: [
      "Leads AI and intelligent feature development at Novaro",
      "Evaluates and adopts production-ready tech stacks",
      "Mentors engineers on best practices & code quality",
      "Guides clients on long-term platform decisions",
    ],
    location: "Gandhinagar, Gujarat, India",
    joined: "Co-founder · 2024",
    education: "Information Technology & Computer Science",
    interests: ["AI/ML", "Cloud platforms", "Emerging tech", "Mentorship"],
  },
  "Alpesh Prajapati": {
    name: "Alpesh Prajapati",
    role: "Manager · Operations & Delivery",
    tier: "manager",
    summary: "Operations manager — sprint delivery, client communication & timelines.",
    bio: "Alpesh keeps Novaro's delivery machine running — sprint planning, client communication, timelines, and making sure nothing falls through the cracks between design, build, and launch. He is the single point of contact for active projects and runs the weekly delivery cadence.",
    department: "Operations & Client Delivery",
    experience: "Manager · 2+ years in agile project delivery",
    focus: [
      "Project management & agile sprint delivery",
      "Client communication & status reporting",
      "Resource planning across design, engineering & marketing",
      "Milestone tracking, scope control & release coordination",
    ],
    skills: [
      "Agile delivery",
      "Client operations",
      "Timeline management",
      "Team coordination",
      "Sprint planning",
      "Stakeholder reporting",
    ],
    highlights: [
      "Single point of contact for active client projects",
      "Runs weekly delivery cadence and milestone tracking",
      "Ensures on-time, on-scope releases across squads",
      "Bridges founders, engineers, and client teams",
    ],
    location: "Gandhinagar, Gujarat, India",
    joined: "Manager · 2024",
    education: "Business Administration & Operations Management",
    interests: ["Process improvement", "Team leadership", "Client success"],
  },
  "Maulik Chaudhary": {
    name: "Maulik Chaudhary",
    role: "Software Developer",
    tier: "employee",
    summary: "Full-stack developer building APIs, frontends & integrations for client products.",
    bio: "Maulik builds the core of Novaro's web products — clean APIs, responsive frontends, and reliable integrations. He turns designs and specs into production code that ships on schedule and holds up under real user load.",
    department: "Engineering",
    experience: "Software Developer · 2+ years in web development",
    focus: [
      "Full-stack web development",
      "API design & third-party integrations",
      "Performance tuning, debugging & bug fixes",
      "Feature delivery across client projects",
    ],
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "MongoDB",
      "JavaScript",
      "Git",
    ],
    highlights: [
      "Shipped features across logistics, D2C, and services clients",
      "Strong focus on readable, maintainable code",
      "Works across frontend and backend as needed",
      "Reliable contributor to Novaro's Gandhinagar delivery team",
    ],
    location: "Gandhinagar, Gujarat, India",
    joined: "Software Developer · 2024",
    education: "Computer Science & Software Development",
    interests: ["Web development", "Problem solving", "Clean code"],
  },
  "Krina Patel": {
    name: "Krina Patel",
    role: "Python Developer",
    tier: "employee",
    summary: "Python developer · BCA (KSV University) · Ahmedabad, Gujarat.",
    bio: "Krina is a Python developer at Novaro Solution in Gandhinagar, building practical skills and gaining hands-on experience in software development. She completed her Bachelor of Computer Applications (BCA) from Kadi Sarva Vishwavidyalaya (KSV University) in April 2026. Passionate about technology and programming, she is dedicated, curious, and always excited to learn new tools and take on fresh challenges.",
    department: "Engineering",
    experience: "Python Developer · Production experience at Novaro",
    focus: [
      "Python development & backend fundamentals",
      "Building practical skills through client projects",
      "Continuous learning in programming & technology",
      "Collaborating with the engineering team on deliverables",
    ],
    skills: [
      "Python",
      "Programming fundamentals",
      "Problem solving",
      "Data structures",
      "BCA · Computer Applications",
    ],
    highlights: [
      "BCA graduate from KSV University (April 2026)",
      "Gaining production experience at Novaro Solution, Gandhinagar",
      "Dedicated to learning new technologies and growing professionally",
      "Contributing to backend and automation tasks on client projects",
    ],
    location: "Ahmedabad, Gujarat, India",
    joined: "Python Developer · Novaro Solution",
    age: 21,
    education: "BCA — Kadi Sarva Vishwavidyalaya (KSV University)",
    graduation: "April 2026",
    phone: "+91 8487012681",
    interests: ["Reading books", "Technology", "Continuous learning", "Python"],
  },
  "Sonal Chaudhary": {
    name: "Sonal Chaudhary",
    role: "Digital Marketing Specialist",
    tier: "employee",
    summary: "Digital marketing — SEO, paid ads, analytics & growth campaigns for clients.",
    bio: "Sonal runs Novaro's growth engine for clients — SEO, paid campaigns, content strategy, and analytics that tie marketing spend to measurable outcomes. She aligns campaigns with product launches and engineering timelines so growth and build move together.",
    department: "Digital Marketing & Growth",
    experience: "Marketing Specialist · 2+ years in SEO & performance ads",
    focus: [
      "SEO & organic content strategy",
      "Paid ads & performance marketing (Google, Meta)",
      "Analytics, reporting & conversion optimisation",
      "Brand visibility & launch campaigns",
    ],
    skills: [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Google Analytics",
      "Content marketing",
      "Social media strategy",
      "Conversion tracking",
    ],
    highlights: [
      "Builds SEO foundations for client product launches",
      "Runs data-driven ad campaigns with clear ROI tracking",
      "Aligns marketing with product and engineering timelines",
      "Reports performance metrics clients can act on",
    ],
    location: "Gandhinagar, Gujarat, India",
    joined: "Digital Marketing · 2024",
    education: "Digital Marketing & Communications",
    interests: ["Content strategy", "Analytics", "Brand growth", "Social media"],
  },
  "Abhi Joshi": {
    name: "Abhi Joshi",
    role: "Finance & Business Automation",
    tier: "employee",
    summary: "MBA (Finance) · CCC · MIC · Tally Prime · AI & Business automation.",
    bio: "Abhi holds an MBA with specialization in Finance and brings strong credentials in accounting, taxation, and business automation to Novaro Solution. With CCC and MIC certifications plus hands-on Tally Prime experience, he supports finance operations, reporting, and AI-driven business automation — helping clients streamline accounts, compliance, and back-office workflows.",
    department: "Finance & Business Automation",
    experience: "MBA Finance · Accounting, Tally & business automation",
    focus: [
      "Financial reporting, accounts & Tally Prime operations",
      "MBA Finance — planning, analysis & business decisions",
      "CCC & MIC — accounting, taxation & compliance fundamentals",
      "AI & business automation for finance and operations",
    ],
    skills: [
      "MBA · Finance",
      "CCC",
      "MIC",
      "Tally Prime",
      "AI & Business automation",
      "Financial reporting",
      "Accounting & taxation",
    ],
    highlights: [
      "MBA specialization in Finance",
      "Certified in CCC and MIC (accounting & taxation)",
      "Proficient in Tally Prime for accounts and GST workflows",
      "Applies AI & business automation to finance and operations",
    ],
    location: "Gandhinagar, Gujarat, India",
    joined: "Finance & Automation · Novaro Solution",
    education: "MBA — Specialization in Finance",
    interests: ["Business automation", "Finance", "Tally & accounting", "AI tools"],
  },
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Match CMS / display names to canonical profile keys */
export function findTeamProfileByName(name: string): TeamProfile | null {
  const trimmed = name.trim();
  if (teamProfiles[trimmed]) return teamProfiles[trimmed];

  const normalized = normalizeName(trimmed);
  for (const [key, profile] of Object.entries(teamProfiles)) {
    if (normalizeName(key) === normalized) return profile;
  }

  const first = trimmed.split(/\s+/)[0]?.toLowerCase();
  if (!first) return null;

  const matches = team.filter((member) =>
    member.name.toLowerCase().startsWith(first),
  );
  if (matches.length === 1) {
    return teamProfiles[matches[0].name] ?? null;
  }

  return null;
}

function assertCompleteProfiles(): void {
  if (process.env.NODE_ENV === "production") return;
  for (const member of team) {
    if (!teamProfiles[member.name]) {
      console.warn(`[team-profiles] Missing profile for: ${member.name}`);
    }
  }
}
assertCompleteProfiles();

export function getTeamProfile(name: string): TeamProfile | null {
  return findTeamProfileByName(name);
}

export function getProfileSummary(name: string, role: string): string {
  const profile = findTeamProfileByName(name);
  return profile?.summary ?? role;
}

export type TeamCardPreview = {
  summary: string;
  education: string;
  skills: string[];
};

/** Card preview — same education & skills shown in the profile modal */
export function getProfileCardPreview(name: string, role: string): TeamCardPreview {
  const profile = findTeamProfileByName(name) ?? mergeTeamProfile(name, role, "employee");
  return {
    summary: profile.summary,
    education: profile.education,
    skills: profile.skills.slice(0, 5),
  };
}

export function getAllTeamProfiles(): TeamProfile[] {
  return team.map((member) => teamProfiles[member.name]).filter(Boolean) as TeamProfile[];
}

export function mergeTeamProfile(
  name: string,
  role: string,
  tier: TeamTier,
): TeamProfile {
  const existing = findTeamProfileByName(name);
  if (existing) return existing;

  return {
    name,
    role,
    tier,
    summary: `${name} — ${role} at Novaro Solution.`,
    bio: `${name} is part of the Novaro team — contributing to web, AI, and growth projects for clients across Gujarat and India.`,
    department: "Novaro Solution",
    experience: "Team member · Novaro Solution",
    focus: ["Client project delivery", "Collaboration across design, build, and launch"],
    skills: ["Collaboration", "Client delivery"],
    highlights: ["Works on production client projects at Novaro Solution"],
    location: "Gandhinagar, Gujarat, India",
    joined: "Team · Novaro Solution",
    education: "Professional experience",
    interests: ["Technology", "Team collaboration"],
  };
}

/** Resolve profile for a grid/modal member — canonical role & tier from team-data.ts */
export function resolveTeamProfile(member: TeamMemberView): TeamProfile {
  const base = findTeamProfileByName(member.name) ?? mergeTeamProfile(
    member.name,
    member.role,
    member.tier,
  );
  const role = resolveCanonicalRole(member.name, base.role);
  return {
    ...base,
    name: member.name,
    role,
    tier: resolveMemberTier(member.name, role),
  };
}
