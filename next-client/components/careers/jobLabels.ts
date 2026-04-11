export const WORK_MODE_LABEL: Record<string, string> = {
  remote: 'Remote',
  onsite: 'On-site',
  hybrid: 'Hybrid'
};

export const EMPLOYMENT_LABEL: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship'
};

export const EXPERIENCE_LABEL: Record<string, string> = {
  entry: 'Entry level',
  mid: 'Mid level',
  senior: 'Senior',
  lead: 'Lead / Staff',
  any: 'Any level'
};

export function formatWorkMode(mode: string) {
  return WORK_MODE_LABEL[mode] || mode;
}

export function formatEmployment(type: string) {
  return EMPLOYMENT_LABEL[type] || type;
}

export function formatExperienceLevel(level: string) {
  return EXPERIENCE_LABEL[level] || level;
}

/** One or two lines for job cards (summary preferred). */
export function jobCardTeaser(job: { summary?: string; description: string }) {
  const s = (job.summary || '').trim();
  if (s) return s;
  return job.description.trim();
}

export function formatApplicationDeadline(iso: string | undefined): { label: string; past: boolean } | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const past = d.getTime() < Date.now();
  return {
    label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    past
  };
}
