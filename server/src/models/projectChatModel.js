import mongoose from 'mongoose';

const projectChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true, lowercase: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ['user', 'admin'], required: true },
    message: { type: String, required: true, trim: true },
    userDeleteRequested: { type: Boolean, default: false, index: true },
    userDeleteRequestedAt: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  },
);

const ProjectChat =
  mongoose.models.ProjectChat || mongoose.model('ProjectChat', projectChatSchema);

function mapMessage(row) {
  return {
    id: String(row._id),
    userId: String(row.userId),
    userName: row.userName,
    userEmail: row.userEmail,
    senderId: String(row.senderId),
    senderRole: row.senderRole,
    message: row.message,
    userDeleteRequested: Boolean(row.userDeleteRequested),
    userDeleteRequestedAt: row.userDeleteRequestedAt || null,
    createdAt: row.createdAt,
  };
}

export async function createProjectChatMessageRow(payload) {
  const row = await ProjectChat.create(payload);
  return mapMessage(row);
}

export async function listProjectChatMessagesByUserId(userId) {
  const rows = await ProjectChat.find({ userId }).sort({ createdAt: 1 }).lean();
  return rows.map(mapMessage);
}

export async function listProjectChatThreadsRows() {
  const rows = await ProjectChat.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$userId',
        userName: { $first: '$userName' },
        userEmail: { $first: '$userEmail' },
        lastMessage: { $first: '$message' },
        lastSenderRole: { $first: '$senderRole' },
        lastMessageAt: { $first: '$createdAt' },
        userDeleteRequested: { $max: '$userDeleteRequested' },
        userDeleteRequestedAt: { $max: '$userDeleteRequestedAt' },
      },
    },
    { $sort: { lastMessageAt: -1 } },
  ]);

  return rows.map((row) => ({
    userId: String(row._id),
    userName: row.userName,
    userEmail: row.userEmail,
    lastMessage: row.lastMessage,
    lastSenderRole: row.lastSenderRole,
    lastMessageAt: row.lastMessageAt,
    userDeleteRequested: Boolean(row.userDeleteRequested),
    userDeleteRequestedAt: row.userDeleteRequestedAt || null,
  }));
}

export async function markProjectChatDeleteRequestedByUserId(userId) {
  const now = new Date();
  await ProjectChat.updateMany(
    { userId },
    { $set: { userDeleteRequested: true, userDeleteRequestedAt: now } },
  );
  return { requestedAt: now };
}

export async function deleteProjectChatThreadByUserId(userId) {
  const result = await ProjectChat.deleteMany({ userId });
  return result.deletedCount || 0;
}

