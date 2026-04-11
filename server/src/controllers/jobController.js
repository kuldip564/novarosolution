import { findUserById } from '../models/userModel.js';
import {
  createJobApplicationRow,
  findApplicationByJobAndUser,
  listApplicationsByUserId,
  markApplicantMessagesRead,
} from '../models/jobApplicationModel.js';
import { findJobByIdRaw, listPublishedJobs, toPublicJob } from '../models/jobModel.js';
import { validateJobApplicationPayload } from '../utils/validators.js';

export async function getPublishedJobs(req, res) {
  try {
    const category = req.query?.category ? String(req.query.category) : '';
    const jobs = await listPublishedJobs({ category: category || undefined });
    return res.status(200).json({ ok: true, data: jobs });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load jobs.',
      error: error.message,
    });
  }
}

export async function getPublishedJobById(req, res) {
  try {
    const { jobId } = req.params;
    const job = await findJobByIdRaw(jobId);
    if (!job || !job.isPublished) {
      return res.status(404).json({ ok: false, message: 'Job not found.' });
    }
    return res.status(200).json({ ok: true, data: toPublicJob(job) });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load job.',
      error: error.message,
    });
  }
}

export async function postJobApplication(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.auth?.userId;
    const job = await findJobByIdRaw(jobId);
    if (!job || !job.isPublished) {
      return res.status(404).json({ ok: false, message: 'This job is not open for applications.' });
    }

    if (job.applicationDeadline) {
      const end = new Date(job.applicationDeadline);
      if (!Number.isNaN(end.getTime()) && end.getTime() < Date.now()) {
        return res.status(400).json({
          ok: false,
          message: 'Applications for this role are no longer accepted.',
        });
      }
    }

    const validationMessage = validateJobApplicationPayload(req.body);
    if (validationMessage) {
      return res.status(400).json({ ok: false, message: validationMessage });
    }

    const existing = await findApplicationByJobAndUser(jobId, userId);
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: 'You have already applied for this position.',
      });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ ok: false, message: 'User not found.' });
    }

    const {
      phone = '',
      coverLetter,
      linkedInUrl = '',
      portfolioUrl = '',
      resumeUrl = '',
      yearsExperience = '',
    } = req.body ?? {};

    const row = await createJobApplicationRow({
      jobId,
      userId,
      applicantName: user.name,
      applicantEmail: user.email,
      phone: String(phone || '').trim(),
      coverLetter: String(coverLetter || '').trim(),
      linkedInUrl: String(linkedInUrl || '').trim(),
      portfolioUrl: String(portfolioUrl || '').trim(),
      resumeUrl: String(resumeUrl || '').trim(),
      yearsExperience: String(yearsExperience || '').trim(),
    });

    return res.status(201).json({
      ok: true,
      message: 'Application submitted successfully.',
      data: row,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: 'You have already applied for this position.',
      });
    }
    return res.status(500).json({
      ok: false,
      message: 'Unable to submit application.',
      error: error.message,
    });
  }
}

export async function getMyJobApplications(req, res) {
  try {
    const userId = req.auth?.userId;
    const rows = await listApplicationsByUserId(userId);
    return res.status(200).json({ ok: true, data: rows });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load your applications.',
      error: error.message,
    });
  }
}

export async function postMarkJobApplicationRead(req, res) {
  try {
    const { applicationId } = req.params;
    const userId = req.auth?.userId;
    const row = await markApplicantMessagesRead(applicationId, userId);
    if (!row) {
      return res.status(404).json({ ok: false, message: 'Application not found.' });
    }
    return res.status(200).json({ ok: true, data: row });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to update read state.',
      error: error.message,
    });
  }
}
