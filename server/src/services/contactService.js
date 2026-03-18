import {
  createContactSubmissionRow,
  listContactSubmissionsRows,
} from '../models/contactSubmissionModel.js';

export async function listContactSubmissions() {
  return listContactSubmissionsRows();
}

export async function createContactSubmission(payload) {
  return createContactSubmissionRow({
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
  });
}

