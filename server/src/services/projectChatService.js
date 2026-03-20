import mongoose from 'mongoose';
import { findFirstAdminUser, findUserById } from '../models/userModel.js';
import { getSiteContent } from './siteContentService.js';
import {
  countProjectChatThreadsRows,
  countProjectChatMessagesByUserId,
  createProjectChatMessageRow,
  deleteProjectChatThreadByUserId,
  listProjectChatMessagesByUserId,
  listProjectChatThreadsRows,
  markProjectChatDeleteRequestedByUserId,
} from '../models/projectChatModel.js';

function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

function isProjectDetailsMessage(message) {
  const text = String(message || '').trim();
  if (!text) return false;
  return (
    text.startsWith('New Project Discussion Request') || text.startsWith('Project Topic Update')
  );
}

export async function sendUserProjectMessage(user, message) {
  const userObjectId = toObjectId(user.id);
  if (!userObjectId) throw new Error('Invalid user.');

  return createProjectChatMessageRow({
    userId: userObjectId,
    userName: user.name,
    userEmail: user.email,
    senderId: userObjectId,
    senderRole: 'user',
    message: message.trim(),
  });
}

export async function listUserProjectMessages(userId, pagination = {}) {
  const userObjectId = toObjectId(userId);
  if (!userObjectId) throw new Error('Invalid user.');
  const [items, total] = await Promise.all([
    listProjectChatMessagesByUserId(userObjectId, pagination),
    countProjectChatMessagesByUserId(userObjectId)
  ]);
  return { items, total };
}

export async function listAdminProjectThreads(pagination = {}) {
  const [items, total] = await Promise.all([
    listProjectChatThreadsRows(pagination),
    countProjectChatThreadsRows()
  ]);
  return { items, total };
}

export async function listAdminProjectMessagesByUserId(targetUserId, pagination = {}) {
  const targetUserObjectId = toObjectId(targetUserId);
  if (!targetUserObjectId) throw new Error('Invalid user.');
  const [items, total] = await Promise.all([
    listProjectChatMessagesByUserId(targetUserObjectId, pagination),
    countProjectChatMessagesByUserId(targetUserObjectId)
  ]);
  return { items, total };
}

export async function sendAdminProjectMessage(adminUser, targetUserId, message) {
  const adminObjectId = toObjectId(adminUser.id);
  const targetUserObjectId = toObjectId(targetUserId);
  if (!adminObjectId || !targetUserObjectId) throw new Error('Invalid user.');

  const targetUser = await findUserById(targetUserId);
  if (!targetUser) {
    throw new Error('Target user not found.');
  }

  return createProjectChatMessageRow({
    userId: targetUserObjectId,
    userName: targetUser.name,
    userEmail: targetUser.email,
    senderId: adminObjectId,
    senderRole: 'admin',
    message: message.trim(),
  });
}

export async function sendAutoAdminReplyIfEnabled(targetUserId, sourceMessage = '') {
  if (!isProjectDetailsMessage(sourceMessage)) {
    return null;
  }

  const content = await getSiteContent();
  const settings = content?.chatSettings || {};
  if (!settings.autoReplyEnabled || !String(settings.autoReplyMessage || '').trim()) {
    return null;
  }

  const admin = await findFirstAdminUser();
  if (!admin) return null;

  return sendAdminProjectMessage(admin, targetUserId, String(settings.autoReplyMessage));
}

export async function requestDeleteMyProjectChat(userId) {
  const userObjectId = toObjectId(userId);
  if (!userObjectId) throw new Error('Invalid user.');
  return markProjectChatDeleteRequestedByUserId(userObjectId);
}

export async function deleteProjectChatByAdmin(targetUserId) {
  const targetUserObjectId = toObjectId(targetUserId);
  if (!targetUserObjectId) throw new Error('Invalid user.');
  return deleteProjectChatThreadByUserId(targetUserObjectId);
}

