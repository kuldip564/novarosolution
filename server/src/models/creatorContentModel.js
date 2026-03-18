import mongoose from 'mongoose';

const creatorContentSchema = new mongoose.Schema(
  {
    creatorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: '', trim: true },
    mediaUrl: { type: String, required: true, trim: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    status: { type: String, enum: ['published'], default: 'published' },
    likedBy: { type: [String], default: [] },
    comments: {
      type: [
        new mongoose.Schema(
          {
            id: { type: String, required: true },
            userId: { type: String, required: true },
            userName: { type: String, default: '' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

const CreatorContent =
  mongoose.models.CreatorContent || mongoose.model('CreatorContent', creatorContentSchema);

function toPayload(doc) {
  return {
    id: String(doc._id),
    creatorId: doc.creatorId,
    title: doc.title,
    caption: doc.caption || '',
    mediaUrl: doc.mediaUrl,
    mediaType: doc.mediaType,
    status: doc.status || 'published',
    likesCount: Array.isArray(doc.likedBy) ? doc.likedBy.length : 0,
    likedBy: Array.isArray(doc.likedBy) ? doc.likedBy : [],
    comments: Array.isArray(doc.comments) ? doc.comments : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createCreatorContent(payload) {
  const created = await CreatorContent.create(payload);
  return toPayload(created);
}

export async function listCreatorContentByCreatorId(creatorId) {
  const rows = await CreatorContent.find({ creatorId }).sort({ createdAt: -1 }).lean();
  return rows.map(toPayload);
}

export async function listAllCreatorContent() {
  const rows = await CreatorContent.find().sort({ createdAt: -1 }).lean();
  return rows.map(toPayload);
}

export async function findCreatorContentById(contentId) {
  if (!mongoose.Types.ObjectId.isValid(contentId)) return null;
  const row = await CreatorContent.findById(contentId).lean();
  return row ? toPayload(row) : null;
}

export async function updateCreatorContentById(contentId, updates) {
  if (!mongoose.Types.ObjectId.isValid(contentId)) return null;
  const updated = await CreatorContent.findByIdAndUpdate(
    contentId,
    { $set: updates },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  return updated ? toPayload(updated) : null;
}

export async function deleteCreatorContentById(contentId) {
  if (!mongoose.Types.ObjectId.isValid(contentId)) return null;
  const deleted = await CreatorContent.findByIdAndDelete(contentId).lean();
  return deleted ? toPayload(deleted) : null;
}

export async function toggleLikeCreatorContent(contentId, userId) {
  if (!mongoose.Types.ObjectId.isValid(contentId)) return null;
  const row = await CreatorContent.findById(contentId);
  if (!row) return null;
  const likedBy = Array.isArray(row.likedBy) ? row.likedBy.map(String) : [];
  const hasLiked = likedBy.includes(String(userId));
  row.likedBy = hasLiked ? likedBy.filter((id) => id !== String(userId)) : [...likedBy, String(userId)];
  await row.save();
  return toPayload(row.toObject());
}

export async function addCommentToCreatorContent(contentId, comment) {
  if (!mongoose.Types.ObjectId.isValid(contentId)) return null;
  const row = await CreatorContent.findById(contentId);
  if (!row) return null;
  const comments = Array.isArray(row.comments) ? row.comments : [];
  row.comments = [...comments, comment];
  await row.save();
  return toPayload(row.toObject());
}
