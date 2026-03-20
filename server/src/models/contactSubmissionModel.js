import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  },
);
contactSubmissionSchema.index({ email: 1, createdAt: -1 });
contactSubmissionSchema.index({ createdAt: -1 });

const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model('ContactSubmission', contactSubmissionSchema);

export async function countContactSubmissions() {
  return ContactSubmission.countDocuments();
}

export async function createContactSubmissionRow({ name, email, subject, message }) {
  const submission = await ContactSubmission.create({
    name,
    email,
    subject,
    message,
  });

  return {
    id: String(submission._id),
    name: submission.name,
    email: submission.email,
    subject: submission.subject,
    message: submission.message,
    createdAt: submission.createdAt,
  };
}

export async function listContactSubmissionsRows({ page, limit } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = ContactSubmission.find().sort({ createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map((row) => ({
    id: String(row._id),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.createdAt,
  }));
}

