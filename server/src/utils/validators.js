export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactPayload(payload) {
  const { name, email, subject, message } = payload ?? {};

  if (!name || !email || !subject || !message) {
    return 'All fields are required.';
  }

  if (!isValidEmail(email)) {
    return 'Please provide a valid email address.';
  }

  return '';
}

const OPTIONAL_URL_MAX = 2048;

function isSafeOptionalUrl(value) {
  const v = String(value || '').trim();
  if (!v) return true;
  if (v.length > OPTIONAL_URL_MAX) return false;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateJobApplicationPayload(payload) {
  const { phone, coverLetter, linkedInUrl, portfolioUrl, resumeUrl, yearsExperience } = payload ?? {};

  if (!coverLetter || String(coverLetter).trim().length < 20) {
    return 'Cover letter must be at least 20 characters.';
  }

  if (String(coverLetter).length > 12000) {
    return 'Cover letter is too long.';
  }

  if (phone !== undefined && phone !== null && String(phone).length > 40) {
    return 'Phone number is too long.';
  }

  if (yearsExperience !== undefined && yearsExperience !== null && String(yearsExperience).length > 80) {
    return 'Experience field is too long.';
  }

  if (!isSafeOptionalUrl(linkedInUrl)) {
    return 'LinkedIn URL must be a valid http(s) link.';
  }
  if (!isSafeOptionalUrl(portfolioUrl)) {
    return 'Portfolio URL must be a valid http(s) link.';
  }
  if (!isSafeOptionalUrl(resumeUrl)) {
    return 'Resume URL must be a valid http(s) link.';
  }

  return '';
}

const ALLOWED_WORK_MODES = new Set(['remote', 'onsite', 'hybrid']);
const ALLOWED_EMPLOYMENT = new Set(['full_time', 'part_time', 'contract', 'internship']);
const ALLOWED_EXPERIENCE = new Set(['entry', 'mid', 'senior', 'lead', 'any']);

export function validateAdminJobPayload(payload, { partial } = {}) {
  const {
    title,
    description,
    summary,
    responsibilities,
    requirements,
    benefits,
    category,
    department,
    location,
    workMode,
    employmentType,
    experienceLevel,
    salaryHint,
    featured,
    sortOrder,
    applicationDeadline,
    isPublished,
  } = payload ?? {};

  if (!partial) {
    if (!title || String(title).trim().length < 2) {
      return 'Title is required.';
    }
    if (!description || String(description).trim().length < 20) {
      return 'Description must be at least 20 characters.';
    }
  } else {
    if (title !== undefined && String(title).trim().length < 2) {
      return 'Title is invalid.';
    }
    if (description !== undefined && String(description).trim().length < 20) {
      return 'Description must be at least 20 characters.';
    }
  }

  if (summary !== undefined && String(summary).length > 500) {
    return 'Summary is too long (max 500 characters).';
  }
  if (responsibilities !== undefined && String(responsibilities).length > 16000) {
    return 'Responsibilities text is too long.';
  }
  if (requirements !== undefined && String(requirements).length > 16000) {
    return 'Requirements text is too long.';
  }
  if (benefits !== undefined && String(benefits).length > 16000) {
    return 'Benefits text is too long.';
  }
  if (category !== undefined && String(category).length > 120) {
    return 'Category is too long.';
  }
  if (department !== undefined && String(department).length > 120) {
    return 'Department is too long.';
  }
  if (location !== undefined && String(location).length > 200) {
    return 'Location is too long.';
  }
  if (salaryHint !== undefined && String(salaryHint).length > 200) {
    return 'Salary hint is too long.';
  }
  if (workMode !== undefined && !ALLOWED_WORK_MODES.has(workMode)) {
    return 'Invalid work mode.';
  }
  if (employmentType !== undefined && !ALLOWED_EMPLOYMENT.has(employmentType)) {
    return 'Invalid employment type.';
  }
  if (experienceLevel !== undefined && !ALLOWED_EXPERIENCE.has(experienceLevel)) {
    return 'Invalid experience level.';
  }
  if (featured !== undefined && typeof featured !== 'boolean') {
    return 'featured must be a boolean.';
  }
  if (sortOrder !== undefined) {
    const n = Number(sortOrder);
    if (!Number.isFinite(n) || n < -9999 || n > 99999) {
      return 'sortOrder must be a number between -9999 and 99999.';
    }
  }
  if (applicationDeadline !== undefined && applicationDeadline !== null && applicationDeadline !== '') {
    const d = new Date(applicationDeadline);
    if (Number.isNaN(d.getTime())) {
      return 'applicationDeadline must be a valid date.';
    }
  }
  if (isPublished !== undefined && typeof isPublished !== 'boolean') {
    return 'isPublished must be a boolean.';
  }

  return '';
}

const APPLICATION_STATUSES = new Set([
  'pending',
  'reviewing',
  'shortlisted',
  'interview',
  'offer',
  'rejected',
  'hired',
]);

const INTERVIEW_ROUNDS = new Set([
  'none',
  'screening',
  'technical',
  'system_design',
  'behavioral',
  'final',
  'offer',
]);

export function validateAdminJobApplicationPatch(payload) {
  const { status, adminNote, interviewRound, appendApplicantMessage } = payload ?? {};
  let hasUpdate = false;

  if (status !== undefined) {
    if (!APPLICATION_STATUSES.has(status)) {
      return 'Invalid application status.';
    }
    hasUpdate = true;
  }
  if (adminNote !== undefined) {
    if (String(adminNote).length > 4000) {
      return 'Admin note is too long.';
    }
    hasUpdate = true;
  }
  if (interviewRound !== undefined) {
    if (!INTERVIEW_ROUNDS.has(interviewRound)) {
      return 'Invalid interview round.';
    }
    hasUpdate = true;
  }
  if (appendApplicantMessage !== undefined) {
    const t = String(appendApplicantMessage || '').trim();
    if (t.length < 1) {
      return 'Applicant message cannot be empty.';
    }
    if (t.length > 8000) {
      return 'Applicant message is too long.';
    }
    hasUpdate = true;
  }

  if (!hasUpdate) {
    return 'Nothing to update.';
  }
  return '';
}
