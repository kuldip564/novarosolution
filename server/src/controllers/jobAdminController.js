import { deleteCacheByPrefix } from '../services/cacheService.js';
import { createJobRow, deleteJobById, listAllJobsAdmin, updateJobById } from '../models/jobModel.js';
import {
  appendApplicantMessage as pushApplicantMessage,
  deleteApplicationsByJobId,
  findJobApplicationByIdForAdmin,
  listJobApplicationsAdmin,
  updateJobApplicationById,
} from '../models/jobApplicationModel.js';
import { parsePagination } from '../utils/pagination.js';
import {
  validateAdminJobApplicationPatch,
  validateAdminJobPayload,
} from '../utils/validators.js';

function sanitizeUserForAdmin(user) {
  if (!user || !user._id) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
  };
}

function sanitizeJobForAdmin(job) {
  if (!job || !job._id) return null;
  const deadline = job.applicationDeadline ? new Date(job.applicationDeadline) : null;
  return {
    id: String(job._id),
    title: job.title,
    description: job.description,
    summary: job.summary || '',
    responsibilities: job.responsibilities || '',
    requirements: job.requirements || '',
    benefits: job.benefits || '',
    category: job.category,
    department: job.department || '',
    location: job.location || '',
    workMode: job.workMode,
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel || 'any',
    salaryHint: job.salaryHint || '',
    featured: job.featured === true,
    sortOrder: typeof job.sortOrder === 'number' ? job.sortOrder : 0,
    applicationDeadline: deadline && !Number.isNaN(deadline.getTime()) ? deadline.toISOString() : '',
    isPublished: job.isPublished !== false,
  };
}

export async function getAdminJobs(req, res) {
  try {
    const jobs = await listAllJobsAdmin();
    return res.status(200).json({ ok: true, data: jobs });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load jobs.',
      error: error.message,
    });
  }
}

export async function postAdminJob(req, res) {
  try {
    const validationMessage = validateAdminJobPayload(req.body, { partial: false });
    if (validationMessage) {
      return res.status(400).json({ ok: false, message: validationMessage });
    }

    const {
      title,
      description,
      summary = '',
      responsibilities = '',
      requirements = '',
      benefits = '',
      category = 'General',
      department = '',
      location = '',
      workMode = 'remote',
      employmentType = 'full_time',
      experienceLevel = 'any',
      salaryHint = '',
      featured = false,
      sortOrder = 0,
      applicationDeadline = null,
      isPublished = true,
    } = req.body ?? {};

    const deadlineRaw = applicationDeadline ? new Date(applicationDeadline) : null;
    const deadline =
      deadlineRaw && !Number.isNaN(deadlineRaw.getTime()) ? deadlineRaw : null;

    const job = await createJobRow({
      title: String(title).trim(),
      description: String(description).trim(),
      summary: String(summary).trim(),
      responsibilities: String(responsibilities).trim(),
      requirements: String(requirements).trim(),
      benefits: String(benefits).trim(),
      category: String(category).trim() || 'General',
      department: String(department).trim(),
      location: String(location).trim(),
      workMode,
      employmentType,
      experienceLevel,
      salaryHint: String(salaryHint).trim(),
      featured: Boolean(featured),
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      applicationDeadline: deadline,
      isPublished: Boolean(isPublished),
    });
    await deleteCacheByPrefix('overview:');
    return res.status(201).json({ ok: true, data: job });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to create job.',
      error: error.message,
    });
  }
}

export async function patchAdminJob(req, res) {
  try {
    const { jobId } = req.params;
    const validationMessage = validateAdminJobPayload(req.body, { partial: true });
    if (validationMessage) {
      return res.status(400).json({ ok: false, message: validationMessage });
    }

    const patch = {};
    const body = req.body ?? {};
    if (body.title !== undefined) patch.title = String(body.title).trim();
    if (body.description !== undefined) patch.description = String(body.description).trim();
    if (body.summary !== undefined) patch.summary = String(body.summary).trim();
    if (body.responsibilities !== undefined) patch.responsibilities = String(body.responsibilities).trim();
    if (body.requirements !== undefined) patch.requirements = String(body.requirements).trim();
    if (body.benefits !== undefined) patch.benefits = String(body.benefits).trim();
    if (body.category !== undefined) patch.category = String(body.category).trim() || 'General';
    if (body.department !== undefined) patch.department = String(body.department).trim();
    if (body.location !== undefined) patch.location = String(body.location).trim();
    if (body.workMode !== undefined) patch.workMode = body.workMode;
    if (body.employmentType !== undefined) patch.employmentType = body.employmentType;
    if (body.experienceLevel !== undefined) patch.experienceLevel = body.experienceLevel;
    if (body.salaryHint !== undefined) patch.salaryHint = String(body.salaryHint).trim();
    if (body.featured !== undefined) patch.featured = Boolean(body.featured);
    if (body.sortOrder !== undefined) {
      const n = Number(body.sortOrder);
      patch.sortOrder = Number.isFinite(n) ? n : 0;
    }
    if (body.applicationDeadline !== undefined) {
      if (body.applicationDeadline === null || body.applicationDeadline === '') {
        patch.applicationDeadline = null;
      } else {
        const d = new Date(body.applicationDeadline);
        patch.applicationDeadline = Number.isNaN(d.getTime()) ? null : d;
      }
    }
    if (body.isPublished !== undefined) patch.isPublished = Boolean(body.isPublished);

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ ok: false, message: 'No valid fields to update.' });
    }

    const updated = await updateJobById(jobId, patch);
    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Job not found.' });
    }
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to update job.',
      error: error.message,
    });
  }
}

export async function deleteAdminJob(req, res) {
  try {
    const { jobId } = req.params;
    await deleteApplicationsByJobId(jobId);
    const removed = await deleteJobById(jobId);
    if (!removed) {
      return res.status(404).json({ ok: false, message: 'Job not found.' });
    }
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, message: 'Job removed.' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to delete job.',
      error: error.message,
    });
  }
}

export async function getAdminJobApplications(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const jobId = req.query?.jobId ? String(req.query.jobId) : '';
    const status = req.query?.status ? String(req.query.status) : '';
    const q = req.query?.q ? String(req.query.q) : '';
    const result = await listJobApplicationsAdmin({
      page,
      limit: limit || 50,
      jobId: jobId || undefined,
      status: status || undefined,
      q: q || undefined,
    });
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load applications.',
      error: error.message,
    });
  }
}

export async function getAdminJobApplicationById(req, res) {
  try {
    const { applicationId } = req.params;
    const result = await findJobApplicationByIdForAdmin(applicationId);
    if (!result) {
      return res.status(404).json({ ok: false, message: 'Application not found.' });
    }
    return res.status(200).json({
      ok: true,
      data: {
        application: result.application,
        user: sanitizeUserForAdmin(result.user),
        job: sanitizeJobForAdmin(result.job),
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load application.',
      error: error.message,
    });
  }
}

export async function patchAdminJobApplication(req, res) {
  try {
    const { applicationId } = req.params;
    const validationMessage = validateAdminJobApplicationPatch(req.body);
    if (validationMessage) {
      return res.status(400).json({ ok: false, message: validationMessage });
    }

    const patch = {};
    if (req.body?.status !== undefined) patch.status = req.body.status;
    if (req.body?.adminNote !== undefined) patch.adminNote = String(req.body.adminNote || '').trim();
    if (req.body?.interviewRound !== undefined) patch.interviewRound = req.body.interviewRound;

    const appendText =
      req.body?.appendApplicantMessage !== undefined
        ? String(req.body.appendApplicantMessage || '').trim()
        : null;

    let updated = null;
    if (Object.keys(patch).length > 0) {
      updated = await updateJobApplicationById(applicationId, patch);
    }
    if (appendText) {
      updated = await pushApplicantMessage(applicationId, {
        body: appendText,
        sentByAdminId: req.auth.userId,
      });
    }

    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Application not found.' });
    }
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to update application.',
      error: error.message,
    });
  }
}
