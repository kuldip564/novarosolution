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

export function formatWorkMode(mode: string) {
  return WORK_MODE_LABEL[mode] || mode;
}

export function formatEmployment(type: string) {
  return EMPLOYMENT_LABEL[type] || type;
}
