import mongoose from 'mongoose';

const APPLICANT_STATUSES = [
  'pending',
  'reviewing',
  'shortlisted',
  'interview',
  'offer',
  'rejected',
  'hired',
];

const INTERVIEW_ROUNDS = [
  'none',
  'screening',
  'technical',
  'system_design',
  'behavioral',
  'final',
  'offer',
];

const applicantMessageSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 8000 },
    sentAt: { type: Date, default: Date.now },
    sentByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true },
);

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    coverLetter: { type: String, required: true, trim: true },
    linkedInUrl: { type: String, default: '', trim: true },
    portfolioUrl: { type: String, default: '', trim: true },
    resumeUrl: { type: String, default: '', trim: true },
    /** Optional second file (e.g. portfolio PDF, certificate). */
    additionalDocumentUrl: { type: String, default: '', trim: true },
    additionalDocumentName: { type: String, default: '', trim: true },
    yearsExperience: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: APPLICANT_STATUSES,
      default: 'pending',
      index: true,
    },
    interviewRound: {
      type: String,
      enum: INTERVIEW_ROUNDS,
      default: 'none',
      index: true,
    },
    adminNote: { type: String, default: '', trim: true },
    applicantMessages: { type: [applicantMessageSchema], default: [] },
    applicantLastReadAt: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
jobApplicationSchema.index({ status: 1, createdAt: -1 });
jobApplicationSchema.index({ createdAt: -1 });

const JobApplication =
  mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

/** Normalize populated Mongoose refs to id strings (avoid "[object Object]" in API payloads). */
function refId(val) {
  if (val == null) return '';
  if (typeof val === 'object' && val._id != null) return String(val._id);
  return String(val);
}

function mapMessages(msgs) {
  if (!Array.isArray(msgs)) return [];
  return msgs.map((m) => ({
    id: m._id ? String(m._id) : '',
    body: m.body,
    sentAt: m.sentAt,
    sentByAdminId: m.sentByAdminId ? String(m.sentByAdminId) : '',
  }));
}

function computeUnreadUpdates(row) {
  const msgs = row.applicantMessages;
  if (!Array.isArray(msgs) || msgs.length === 0) return false;
  const last = msgs[msgs.length - 1];
  const lastAt = last?.sentAt ? new Date(last.sentAt).getTime() : 0;
  if (!row.applicantLastReadAt) return true;
  return lastAt > new Date(row.applicantLastReadAt).getTime();
}

function mapApp(doc, extras = {}) {
  if (!doc) return null;
  const row = doc._id ? doc : doc;
  const applicantMessages = mapMessages(row.applicantMessages);
  return {
    id: String(row._id),
    jobId: refId(row.jobId),
    userId: refId(row.userId),
    applicantName: row.applicantName,
    applicantEmail: row.applicantEmail,
    phone: row.phone || '',
    coverLetter: row.coverLetter,
    linkedInUrl: row.linkedInUrl || '',
    portfolioUrl: row.portfolioUrl || '',
    resumeUrl: row.resumeUrl || '',
    additionalDocumentUrl: row.additionalDocumentUrl || '',
    additionalDocumentName: row.additionalDocumentName || '',
    yearsExperience: row.yearsExperience || '',
    status: row.status,
    interviewRound: row.interviewRound || 'none',
    adminNote: row.adminNote || '',
    applicantMessages,
    applicantLastReadAt: row.applicantLastReadAt || null,
    unreadUpdates: computeUnreadUpdates(row),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    ...extras,
  };
}

export async function findApplicationByJobAndUser(jobId, userId) {
  if (!mongoose.isValidObjectId(jobId) || !mongoose.isValidObjectId(userId)) return null;
  const row = await JobApplication.findOne({ jobId, userId }).lean();
  return row ? mapApp(row) : null;
}

export async function createJobApplicationRow(payload) {
  const app = await JobApplication.create(payload);
  return mapApp(app);
}

export async function listApplicationsByUserId(userId) {
  if (!mongoose.isValidObjectId(userId)) return [];
  const rows = await JobApplication.find({ userId })
    .sort({ createdAt: -1 })
    .populate('jobId', 'title category')
    .lean();
  return rows.map((row) => {
    const job = row.jobId;
    const m = mapApp(row, {
      jobTitle: job?.title || '(role)',
      jobCategory: job?.category || '',
    });
    delete m.adminNote;
    return m;
  });
}

export async function countJobApplications(filter = {}) {
  return JobApplication.countDocuments(filter);
}

export async function deleteApplicationsByJobId(jobId) {
  if (!mongoose.isValidObjectId(jobId)) return;
  await JobApplication.deleteMany({ jobId });
}

export async function updateJobApplicationById(id, patch) {
  if (!mongoose.isValidObjectId(id)) return null;
  const row = await JobApplication.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true })
    .populate('jobId', 'title category')
    .populate('userId', 'name email')
    .lean();
  if (!row) return null;
  const job = row.jobId;
  const user = row.userId;
  return mapApp(row, {
    jobTitle: job?.title || '',
    jobCategory: job?.category || '',
    userName: user?.name || row.applicantName,
    userEmail: user?.email || row.applicantEmail,
  });
}

export async function appendApplicantMessage(applicationId, { body, sentByAdminId }) {
  if (!mongoose.isValidObjectId(applicationId)) return null;
  const row = await JobApplication.findByIdAndUpdate(
    applicationId,
    {
      $push: {
        applicantMessages: {
          body,
          sentAt: new Date(),
          sentByAdminId,
        },
      },
    },
    { new: true, runValidators: true },
  )
    .populate('jobId', 'title category')
    .populate('userId', 'name email')
    .lean();
  if (!row) return null;
  const job = row.jobId;
  const user = row.userId;
  return mapApp(row, {
    jobTitle: job?.title || '',
    jobCategory: job?.category || '',
    userName: user?.name || row.applicantName,
    userEmail: user?.email || row.applicantEmail,
  });
}

export async function markApplicantMessagesRead(applicationId, userId) {
  if (!mongoose.isValidObjectId(applicationId) || !mongoose.isValidObjectId(userId)) return null;
  const row = await JobApplication.findOneAndUpdate(
    { _id: applicationId, userId },
    { $set: { applicantLastReadAt: new Date() } },
    { new: true },
  )
    .populate('jobId', 'title category')
    .lean();
  if (!row) return null;
  const job = row.jobId;
  const m = mapApp(row, {
    jobTitle: job?.title || '(role)',
    jobCategory: job?.category || '',
  });
  delete m.adminNote;
  return m;
}

export async function findJobApplicationByIdForAdmin(applicationId) {
  if (!mongoose.isValidObjectId(applicationId)) return null;
  const row = await JobApplication.findById(applicationId)
    .populate('jobId')
    .populate('userId')
    .lean();
  if (!row) return null;
  const job = row.jobId;
  const user = row.userId;
  return {
    application: mapApp(row, {
      jobTitle: job?.title || '',
      jobCategory: job?.category || '',
      jobDescription: job?.description || '',
      userName: user?.name || row.applicantName,
      userEmail: user?.email || row.applicantEmail,
    }),
    job,
    user,
  };
}

export async function listJobApplicationsAdmin({ page, limit, jobId, status, q } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 50;
  const skip = (normalizedPage - 1) * normalizedLimit;
  const filter = {};
  if (jobId && mongoose.isValidObjectId(jobId)) filter.jobId = jobId;
  if (status && APPLICANT_STATUSES.includes(status)) {
    filter.status = status;
  }
  const search = String(q || '').trim();
  if (search.length >= 1) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ applicantName: rx }, { applicantEmail: rx }];
  }

  const [rows, total] = await Promise.all([
    JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .populate('jobId', 'title category isPublished')
      .populate('userId', 'name email avatarUrl role isActive createdAt')
      .lean(),
    JobApplication.countDocuments(filter),
  ]);

  return {
    items: rows.map((row) => {
      const job = row.jobId;
      const user = row.userId;
      return mapApp(row, {
        jobTitle: job?.title || '(deleted job)',
        jobCategory: job?.category || '',
        jobIsPublished: job?.isPublished,
        userName: user?.name || row.applicantName,
        userEmail: user?.email || row.applicantEmail,
        userAvatarUrl: user?.avatarUrl || '',
        userRole: user?.role || '',
        userMemberSince: user?.createdAt || null,
        userIsActive: user?.isActive !== false,
      });
    }),
    total,
    page: normalizedPage,
    limit: normalizedLimit,
    totalPages: Math.max(Math.ceil(total / normalizedLimit), 1),
  };
}
