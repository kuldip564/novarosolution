import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user', 'employee', 'creator'], default: 'user' },
    creatorRequestStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    creatorRequestMessage: { type: String, default: '' },
    creatorRequestedAt: { type: Date, default: null },
    creatorReviewedAt: { type: Date, default: null },
    creatorReviewedById: { type: String, default: '' },
    tokenVersion: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ creatorRequestStatus: 1, createdAt: -1 });
userSchema.index({ isActive: 1, role: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function countUsers() {
  return User.countDocuments();
}

export async function countUsersByRole(role) {
  return User.countDocuments({ role });
}

export async function countActiveUsersByRole(role) {
  return User.countDocuments({ role, isActive: { $ne: false } });
}

export async function findUserByEmail(email) {
  const user = await User.findOne({ email })
    .select('name email password avatarUrl role creatorRequestStatus creatorRequestMessage creatorRequestedAt creatorReviewedAt creatorReviewedById tokenVersion isActive createdAt')
    .lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function findUserByName(name) {
  const user = await User.findOne({ name })
    .select('name email password avatarUrl role creatorRequestStatus creatorRequestMessage creatorRequestedAt creatorReviewedAt creatorReviewedById tokenVersion isActive createdAt')
    .lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function findUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const user = await User.findById(userId)
    .select('name email password avatarUrl role creatorRequestStatus creatorRequestMessage creatorRequestedAt creatorReviewedAt creatorReviewedById tokenVersion isActive createdAt')
    .lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function createUser({
  name,
  email,
  password,
  role,
  avatarUrl = '',
  creatorRequestStatus = 'none',
  creatorRequestMessage = '',
  creatorRequestedAt = null,
  creatorReviewedAt = null,
  creatorReviewedById = '',
}) {
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatarUrl,
    creatorRequestStatus,
    creatorRequestMessage,
    creatorRequestedAt,
    creatorReviewedAt,
    creatorReviewedById,
  });

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function updateUserById(userId, updates) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { returnDocument: 'after', runValidators: true },
  ).lean();

  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function incrementUserTokenVersionById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { tokenVersion: 1 } },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function deleteUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const user = await User.findByIdAndDelete(userId).lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    createdAt: user.createdAt,
  };
}

export async function listUsers({ page, limit, projection, filter } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = User.find(filter || {})
    .select(
      projection ||
        'name email avatarUrl role creatorRequestStatus creatorRequestMessage creatorRequestedAt creatorReviewedAt creatorReviewedById isActive createdAt tokenVersion'
    )
    .sort({ createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const users = await query.lean();
  return users.map((user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  }));
}

export async function countUsersWithFilter(filter = {}) {
  return User.countDocuments(filter);
}

export async function findUsersByIds(userIds, { projection } = {}) {
  const ids = (Array.isArray(userIds) ? userIds : [])
    .map((id) => String(id))
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));
  if (!ids.length) return [];

  const rows = await User.find({ _id: { $in: ids } })
    .select(projection || 'name email role avatarUrl isActive createdAt')
    .lean();

  return rows.map((user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    isActive: user.isActive !== false,
    createdAt: user.createdAt
  }));
}

export async function findFirstAdminUser() {
  const user = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    creatorReviewedById: user.creatorReviewedById || '',
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

