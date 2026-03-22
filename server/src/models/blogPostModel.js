import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: '', trim: true },
    content: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, default: '', trim: true },
    authorId: { type: String, default: '', index: true },
    authorName: { type: String, default: '', trim: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    publishedAt: { type: Date, default: null, index: true },
    seoTitle: { type: String, default: '', trim: true },
    seoDescription: { type: String, default: '', trim: true },
    seoKeywords: { type: [String], default: [] }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);

blogPostSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });
blogPostSchema.index({ slug: 1 }, { unique: true });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

function toPayload(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || '',
    content: doc.content || '',
    coverImageUrl: doc.coverImageUrl || '',
    authorId: doc.authorId || '',
    authorName: doc.authorName || '',
    status: doc.status || 'draft',
    publishedAt: doc.publishedAt || null,
    seoTitle: doc.seoTitle || '',
    seoDescription: doc.seoDescription || '',
    seoKeywords: Array.isArray(doc.seoKeywords) ? doc.seoKeywords : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function createBlogPost(payload) {
  const created = await BlogPost.create(payload);
  return toPayload(created);
}

export async function countBlogPosts(filter = {}) {
  return BlogPost.countDocuments(filter);
}

export async function listPublicBlogPosts({ page, limit } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = BlogPost.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map(toPayload);
}

export async function listAllBlogPosts({ page, limit } = {}) {
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : null;
  const skip = normalizedLimit ? (normalizedPage - 1) * normalizedLimit : 0;
  const query = BlogPost.find().sort({ createdAt: -1 });
  if (normalizedLimit) query.skip(skip).limit(normalizedLimit);
  const rows = await query.lean();
  return rows.map(toPayload);
}

export async function findBlogPostBySlug(slug) {
  const row = await BlogPost.findOne({ slug: String(slug || '').toLowerCase().trim() }).lean();
  return row ? toPayload(row) : null;
}

export async function findPublicBlogPostBySlug(slug) {
  const row = await BlogPost.findOne({
    slug: String(slug || '').toLowerCase().trim(),
    status: 'published'
  }).lean();
  return row ? toPayload(row) : null;
}

export async function findBlogPostById(blogId) {
  if (!mongoose.Types.ObjectId.isValid(blogId)) return null;
  const row = await BlogPost.findById(blogId).lean();
  return row ? toPayload(row) : null;
}

export async function updateBlogPostById(blogId, updates) {
  if (!mongoose.Types.ObjectId.isValid(blogId)) return null;
  const updated = await BlogPost.findByIdAndUpdate(
    blogId,
    { $set: updates },
    { returnDocument: 'after', runValidators: true }
  ).lean();
  return updated ? toPayload(updated) : null;
}

export async function deleteBlogPostById(blogId) {
  if (!mongoose.Types.ObjectId.isValid(blogId)) return null;
  const deleted = await BlogPost.findByIdAndDelete(blogId).lean();
  return deleted ? toPayload(deleted) : null;
}
