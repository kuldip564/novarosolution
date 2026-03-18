import bcrypt from 'bcryptjs';
import { createAuthToken } from '../utils/token.js';
import { isImageDataUrl, uploadImageDataUrl } from './cloudinaryService.js';
import {
  countUsers,
  createUser,
  findUserByEmail,
  findUserByName,
  findUserById,
  updateUserById,
} from '../models/userModel.js';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    creatorRequestStatus: user.creatorRequestStatus || 'none',
    creatorRequestMessage: user.creatorRequestMessage || '',
    creatorRequestedAt: user.creatorRequestedAt || null,
    creatorReviewedAt: user.creatorReviewedAt || null,
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
  };
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error('Email already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const usersCount = await countUsers();
  const role = usersCount === 0 ? 'admin' : 'user';
  const newUser = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  const safeUser = sanitizeUser(newUser);
  const token = createAuthToken({
    userId: safeUser.id,
    email: safeUser.email,
    role: safeUser.role,
    tokenVersion: Number(newUser.tokenVersion || 0),
  });

  return { user: safeUser, token };
}

export async function loginUser({ email, password }) {
  const normalizedInput = email.trim().toLowerCase();
  const user =
    normalizedInput.includes('@')
      ? await findUserByEmail(normalizedInput)
      : await findUserByName(email.trim());
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (user.isActive === false) {
    throw new Error('Account is disabled. Please contact admin.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password.');
  }

  const safeUser = sanitizeUser(user);
  const token = createAuthToken({
    userId: safeUser.id,
    email: safeUser.email,
    role: safeUser.role,
    tokenVersion: Number(user.tokenVersion || 0),
  });

  return { user: safeUser, token };
}

export async function getUserById(userId) {
  const user = await findUserById(userId);
  return user ? sanitizeUser(user) : null;
}

export async function updateProfile(userId, { name, email, avatarUrl, avatarDataUrl }) {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new Error('User not found.');
  }

  const updates = {};
  if (name && String(name).trim()) {
    updates.name = String(name).trim();
  }

  if (email && String(email).trim()) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const userByEmail = await findUserByEmail(normalizedEmail);
    if (userByEmail && userByEmail.id !== userId) {
      throw new Error('Email already in use.');
    }
    updates.email = normalizedEmail;
  }

  if (typeof avatarDataUrl === 'string' && avatarDataUrl.trim()) {
    if (!isImageDataUrl(avatarDataUrl)) {
      throw new Error('Invalid profile image format.');
    }
    updates.avatarUrl = await uploadImageDataUrl(avatarDataUrl, {
      folder: 'novarosolution/profile-photos',
      publicIdPrefix: `user-${userId}`,
    });
  } else if (typeof avatarUrl === 'string') {
    updates.avatarUrl = avatarUrl.trim();
  }

  if (!Object.keys(updates).length) {
    return sanitizeUser(existingUser);
  }

  const updatedUser = await updateUserById(userId, updates);
  if (!updatedUser) {
    throw new Error('User not found.');
  }
  return sanitizeUser(updatedUser);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new Error('User not found.');
  }

  const isValidCurrentPassword = await bcrypt.compare(currentPassword, existingUser.password);
  if (!isValidCurrentPassword) {
    throw new Error('Current password is incorrect.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await updateUserById(userId, { password: hashedPassword });
  if (!updatedUser) {
    throw new Error('User not found.');
  }
  return sanitizeUser(updatedUser);
}

export async function requestCreatorAccess(userId, { message = '' } = {}) {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new Error('User not found.');
  }
  if (existingUser.role === 'admin') {
    throw new Error('Admin already has elevated access.');
  }
  if (existingUser.role === 'creator') {
    throw new Error('You are already a creator.');
  }
  if (existingUser.creatorRequestStatus === 'pending') {
    throw new Error('Creator access request is already pending admin approval.');
  }

  const updatedUser = await updateUserById(userId, {
    creatorRequestStatus: 'pending',
    creatorRequestMessage: String(message || '').trim(),
    creatorRequestedAt: new Date(),
    creatorReviewedAt: null,
    creatorReviewedById: '',
  });
  if (!updatedUser) {
    throw new Error('User not found.');
  }
  return sanitizeUser(updatedUser);
}

