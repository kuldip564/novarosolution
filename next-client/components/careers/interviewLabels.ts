export const INTERVIEW_ROUND_LABEL: Record<string, string> = {
  none: 'Not scheduled',
  screening: 'Screening',
  technical: 'Technical',
  system_design: 'System design',
  behavioral: 'Behavioral',
  final: 'Final',
  offer: 'Offer stage'
};

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  reviewing: 'Under review',
  shortlisted: 'Shortlisted',
  interview: 'Interview process',
  offer: 'Offer extended',
  rejected: 'Not selected',
  hired: 'Hired'
};

export function formatInterviewRound(round: string) {
  return INTERVIEW_ROUND_LABEL[round] || round;
}

export function formatApplicationStatus(status: string) {
  return APPLICATION_STATUS_LABEL[status] || status;
}
