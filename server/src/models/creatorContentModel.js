import mongoose from 'mongoose';

const creatorContentSchema = new mongoose.Schema(
  {
    creatorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    caption: { type: String, default: '', trim: true },
    mediaUrl: { type: String, required: true, trim: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    status: { type: String, enum: ['published'], default: 'published' },
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
    platform: doc.platform,
    caption: doc.caption || '',
    mediaUrl: doc.mediaUrl,
    mediaType: doc.mediaType,
    status: doc.status || 'published',
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
