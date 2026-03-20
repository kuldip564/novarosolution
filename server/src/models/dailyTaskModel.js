import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    plannedTask: { type: String, default: '', trim: true },
    adminNote: { type: String, default: '', trim: true },
    workUpdate: { type: String, default: '', trim: true },
    proofLink: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
      index: true,
    },
    workDate: { type: Date, default: Date.now, index: true },
    jobStartAt: { type: Date },
    jobEndAt: { type: Date },
    completedAt: { type: Date, default: null },
    approvalRequested: { type: Boolean, default: false, index: true },
    approvalRejected: { type: Boolean, default: false, index: true },
    approvedAt: { type: Date, default: null },
    approvedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);
dailyTaskSchema.index({ employeeId: 1, workDate: -1, createdAt: -1 });
dailyTaskSchema.index({ status: 1, approvalRequested: 1, workDate: -1 });

const DailyTask = mongoose.models.DailyTask || mongoose.model('DailyTask', dailyTaskSchema);

function normalizeTask(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    employeeId: String(doc.employeeId),
    assignedById: String(doc.assignedById),
    title: doc.title,
    plannedTask: doc.plannedTask || '',
    adminNote: doc.adminNote || '',
    workUpdate: doc.workUpdate || '',
    proofLink: doc.proofLink || '',
    status: doc.status || 'pending',
    workDate: doc.workDate,
    jobStartAt: doc.jobStartAt || null,
    jobEndAt: doc.jobEndAt || null,
    completedAt: doc.completedAt || null,
    approvalRequested: doc.approvalRequested === true,
    approvalRejected: doc.approvalRejected === true,
    approvedAt: doc.approvedAt || null,
    approvedById: doc.approvedById ? String(doc.approvedById) : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createDailyTask(payload) {
  const created = await DailyTask.create(payload);
  return normalizeTask(created.toObject());
}

export async function listAllDailyTasks({ page, limit } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 200) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = DailyTask.find().sort({ workDate: -1, createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map(normalizeTask);
}

export async function listDailyTasksByEmployee(employeeId, { page, limit } = {}) {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) return [];
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 200) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = DailyTask.find({ employeeId }).sort({ workDate: -1, createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map(normalizeTask);
}

export async function countDailyTasks(filter = {}) {
  return DailyTask.countDocuments(filter);
}

export async function updateDailyTaskById(taskId, updates) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) return null;
  const row = await DailyTask.findByIdAndUpdate(
    taskId,
    { $set: updates },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  return normalizeTask(row);
}

export async function deleteDailyTaskById(taskId) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) return null;
  const row = await DailyTask.findByIdAndDelete(taskId).lean();
  return normalizeTask(row);
}

export async function updateDailyTaskByIdForEmployee(taskId, employeeId, updates) {
  if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(employeeId)) return null;
  const row = await DailyTask.findOneAndUpdate(
    { _id: taskId, employeeId },
    { $set: updates },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  return normalizeTask(row);
}

export async function deleteDailyTaskByIdForEmployee(taskId, employeeId) {
  if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(employeeId)) return null;
  const row = await DailyTask.findOneAndDelete({ _id: taskId, employeeId }).lean();
  return normalizeTask(row);
}
