import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, default: 'Employee', trim: true },
    department: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    joinedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);
employeeSchema.index({ isActive: 1, createdAt: -1 });
employeeSchema.index({ userId: 1, isActive: 1 });

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

function normalizeEmployee(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    userId: doc.userId ? String(doc.userId) : null,
    name: doc.name,
    email: doc.email,
    role: doc.role || 'Employee',
    department: doc.department || '',
    phone: doc.phone || '',
    joinedAt: doc.joinedAt,
    notes: doc.notes || '',
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createEmployee(payload) {
  const created = await Employee.create(payload);
  return normalizeEmployee(created.toObject());
}

export async function listEmployees({ page, limit } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = Employee.find().sort({ createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map(normalizeEmployee);
}

export async function countEmployees(filter = {}) {
  return Employee.countDocuments(filter);
}

export async function findEmployeeById(employeeId) {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) return null;
  const row = await Employee.findById(employeeId).lean();
  return normalizeEmployee(row);
}

export async function findEmployeeByEmail(email) {
  const row = await Employee.findOne({ email: String(email || '').toLowerCase() }).lean();
  return normalizeEmployee(row);
}

export async function updateEmployeeById(employeeId, updates) {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) return null;
  const row = await Employee.findByIdAndUpdate(
    employeeId,
    { $set: updates },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  return normalizeEmployee(row);
}

export async function deleteEmployeeById(employeeId) {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) return null;
  const row = await Employee.findByIdAndDelete(employeeId).lean();
  return normalizeEmployee(row);
}
