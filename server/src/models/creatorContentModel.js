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
creatorContentSchema.index({ creatorId: 1, createdAt: -1 });
creatorContentSchema.index({ status: 1, createdAt: -1 });
creatorContentSchema.index({ status: 1, updatedAt: -1 });

const CreatorContent =
  mongoose.models.CreatorContent || mongoose.model('CreatorContent', creatorContentSchema);

function normalizeSortBy(sortBy) {
  if (sortBy === 'popular' || sortBy === 'discussed') return sortBy;
  return 'latest';
}

function toPayload(doc, options = {}) {
  const { summary = false, commentsPreviewLimit = 3 } = options;
  const likedBy = Array.isArray(doc.likedBy) ? doc.likedBy : [];
  const comments = Array.isArray(doc.comments) ? doc.comments : [];
  const likesCount =
    typeof doc.likesCount === 'number' ? doc.likesCount : likedBy.length;
  const commentsCount =
    typeof doc.commentsCount === 'number' ? doc.commentsCount : comments.length;
  const commentsPreview = Array.isArray(doc.commentsPreview)
    ? doc.commentsPreview
    : comments.slice(0, Math.max(commentsPreviewLimit, 0));

  return {
    id: String(doc._id),
    creatorId: doc.creatorId,
    title: doc.title,
    caption: doc.caption || '',
    mediaUrl: doc.mediaUrl,
    mediaType: doc.mediaType,
    status: doc.status || 'published',
    likesCount,
    likedByMe: Boolean(doc.likedByMe),
    commentsCount,
    likedBy: summary ? undefined : likedBy,
    comments: summary ? undefined : comments,
    commentsPreview: summary ? commentsPreview : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createCreatorContent(payload) {
  const created = await CreatorContent.create(payload);
  return toPayload(created);
}

export async function listCreatorContentByCreatorId(creatorId, { page, limit } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = CreatorContent.find({ creatorId }).sort({ createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map(toPayload);
}

export async function listAllCreatorContent({
  page,
  limit,
  sortBy = 'latest',
  summary = false,
  status = '',
  viewerId = '',
  commentsPreviewLimit = 3
} = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit =
    Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const normalizedSortBy = normalizeSortBy(sortBy);
  const useSummary = Boolean(summary);
  const normalizedStatus = typeof status === 'string' ? status : '';
  const normalizedViewerId = viewerId ? String(viewerId) : '';
  const normalizedCommentsPreviewLimit =
    Number.isInteger(commentsPreviewLimit) && commentsPreviewLimit >= 0
      ? Math.min(commentsPreviewLimit, 10)
      : 3;

  const filter = normalizedStatus ? { status: normalizedStatus } : {};

  const sortStage =
    normalizedSortBy === 'popular'
      ? { likesCount: -1, createdAt: -1 }
      : normalizedSortBy === 'discussed'
        ? { commentsCount: -1, createdAt: -1 }
        : { createdAt: -1 };

  const pipeline = [
    { $match: filter },
    {
      $addFields: {
        likesCount: { $size: { $ifNull: ['$likedBy', []] } },
        commentsCount: { $size: { $ifNull: ['$comments', []] } },
        commentsPreview: { $slice: [{ $ifNull: ['$comments', []] }, normalizedCommentsPreviewLimit] },
        likedByMe: normalizedViewerId ? { $in: [normalizedViewerId, { $ifNull: ['$likedBy', []] }] } : false
      }
    },
    { $sort: sortStage }
  ];

  if (normalizedLimit) {
    pipeline.push({ $skip: skip }, { $limit: normalizedLimit });
  }

  if (useSummary) {
    pipeline.push({
      $project: {
        creatorId: 1,
        title: 1,
        caption: 1,
        mediaUrl: 1,
        mediaType: 1,
        status: 1,
        likesCount: 1,
        commentsCount: 1,
        commentsPreview: 1,
        likedByMe: 1,
        createdAt: 1,
        updatedAt: 1
      }
    });
  }

  const rows = await CreatorContent.aggregate(pipeline);
  return rows.map((row) =>
    toPayload(row, { summary: useSummary, commentsPreviewLimit: normalizedCommentsPreviewLimit })
  );
}

export async function countCreatorContent(filter = {}) {
  return CreatorContent.countDocuments(filter);
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
