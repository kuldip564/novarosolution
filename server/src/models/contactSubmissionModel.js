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

export async function listContactSubmissionsRows() {
  const rows = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => ({
    id: String(row._id),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.createdAt,
  }));
}

