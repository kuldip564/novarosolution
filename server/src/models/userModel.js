import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user', 'employee'], default: 'user' },
    tokenVersion: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

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
  const user = await User.findOne({ email }).lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function findUserByName(name) {
  const user = await User.findOne({ name }).lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function findUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const user = await User.findById(userId).lean();
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function createUser({ name, email, password, role, avatarUrl = '' }) {
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatarUrl,
  });

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
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
    createdAt: user.createdAt,
  };
}

export async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return users.map((user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
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
    tokenVersion: Number(user.tokenVersion || 0),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

