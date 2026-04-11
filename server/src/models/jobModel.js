import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    /** Short teaser for listings (optional; falls back to description on the client). */
    summary: { type: String, default: '', trim: true },
    responsibilities: { type: String, default: '', trim: true },
    requirements: { type: String, default: '', trim: true },
    benefits: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true, default: 'General' },
    department: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    workMode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote',
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship'],
      default: 'full_time',
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'any'],
      default: 'any',
      index: true,
    },
    salaryHint: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
    applicationDeadline: { type: Date, default: null },
    isPublished: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

jobSchema.index({ isPublished: 1, category: 1, createdAt: -1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ isPublished: 1, featured: -1, sortOrder: -1, createdAt: -1 });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export function toPublicJob(doc) {
  if (!doc) return null;
  const row = doc._id ? doc : doc;
  const deadline = row.applicationDeadline ? new Date(row.applicationDeadline) : null;
  return {
    id: String(row._id),
    title: row.title,
    description: row.description,
    summary: row.summary || '',
    responsibilities: row.responsibilities || '',
    requirements: row.requirements || '',
    benefits: row.benefits || '',
    category: row.category,
    department: row.department || '',
    location: row.location || '',
    workMode: row.workMode,
    employmentType: row.employmentType,
    experienceLevel: row.experienceLevel || 'any',
    salaryHint: row.salaryHint || '',
    featured: row.featured === true,
    sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : 0,
    applicationDeadline: deadline && !Number.isNaN(deadline.getTime()) ? deadline.toISOString() : '',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createJobRow(payload) {
  const job = await Job.create(payload);
  return toPublicJob(job);
}

export async function findJobById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const job = await Job.findById(id).lean();
  return job ? toPublicJob(job) : null;
}

export async function findJobByIdRaw(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Job.findById(id).lean();
}

export async function updateJobById(id, patch) {
  if (!mongoose.isValidObjectId(id)) return null;
  const job = await Job.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true }).lean();
  return job ? toPublicJob(job) : null;
}

export async function deleteJobById(id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Job.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

export async function listPublishedJobs({ category } = {}) {
  const filter = { isPublished: true };
  if (category && String(category).trim()) {
    filter.category = new RegExp(`^${String(category).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  }
  const rows = await Job.find(filter).sort({ featured: -1, sortOrder: -1, createdAt: -1 }).lean();
  return rows.map(toPublicJob);
}

export async function listAllJobsAdmin() {
  const rows = await Job.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => ({
    ...toPublicJob(row),
    isPublished: row.isPublished,
  }));
}

export async function countPublishedJobs() {
  return Job.countDocuments({ isPublished: true });
}

export async function countAllJobs() {
  return Job.countDocuments();
}
