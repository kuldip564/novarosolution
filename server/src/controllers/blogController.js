import {
  countBlogPosts,
  createBlogPost,
  deleteBlogPostById,
  findBlogPostById,
  findBlogPostBySlug,
  findPublicBlogPostBySlug,
  listAllBlogPosts,
  listPublicBlogPosts,
  updateBlogPostById
} from '../models/blogPostModel.js';
import { parsePagination } from '../utils/pagination.js';

function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeKeywords(input) {
  if (Array.isArray(input)) {
    return input.map((item) => String(item || '').trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

async function ensureUniqueSlug(baseSlug, currentPostId = '') {
  let nextSlug = baseSlug;
  let cursor = 2;
  while (nextSlug) {
    const existing = await findBlogPostBySlug(nextSlug);
    if (!existing || existing.id === currentPostId) return nextSlug;
    nextSlug = `${baseSlug}-${cursor}`;
    cursor += 1;
  }
  return '';
}

export async function getPublicBlogPosts(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      listPublicBlogPosts({ page, limit }),
      countBlogPosts({ status: 'published' })
    ]);
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
    return res.status(200).json({
      ok: true,
      data: rows,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load blog posts.',
      error: error.message
    });
  }
}

export async function getPublicBlogPostBySlug(req, res) {
  try {
    const row = await findPublicBlogPostBySlug(req.params.slug);
    if (!row) {
      return res.status(404).json({ ok: false, message: 'Blog post not found.' });
    }
    return res.status(200).json({ ok: true, data: row });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load blog post.',
      error: error.message
    });
  }
}

export async function getAdminBlogPosts(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      listAllBlogPosts({ page, limit }),
      countBlogPosts()
    ]);
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
    return res.status(200).json({
      ok: true,
      data: rows,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load admin blog posts.',
      error: error.message
    });
  }
}

export async function postAdminBlog(req, res) {
  try {
    const body = req.body || {};
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    if (!title) return res.status(400).json({ ok: false, message: 'Title is required.' });
    if (!content) return res.status(400).json({ ok: false, message: 'Content is required.' });

    const preferredSlug = slugify(String(body.slug || title));
    if (!preferredSlug) return res.status(400).json({ ok: false, message: 'Valid slug is required.' });
    const slug = await ensureUniqueSlug(preferredSlug);
    if (!slug) return res.status(400).json({ ok: false, message: 'Unable to generate unique slug.' });

    const status = body.status === 'published' ? 'published' : 'draft';
    const publishedAt = status === 'published'
      ? (body.publishedAt ? new Date(body.publishedAt) : new Date())
      : null;

    const created = await createBlogPost({
      title,
      slug,
      excerpt: String(body.excerpt || '').trim(),
      content,
      coverImageUrl: String(body.coverImageUrl || '').trim(),
      authorId: req.auth?.userId || '',
      authorName: String(body.authorName || '').trim(),
      status,
      publishedAt,
      seoTitle: String(body.seoTitle || '').trim(),
      seoDescription: String(body.seoDescription || '').trim(),
      seoKeywords: normalizeKeywords(body.seoKeywords)
    });
    return res.status(201).json({ ok: true, data: created, message: 'Blog post created.' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to create blog post.'
    });
  }
}

export async function patchAdminBlog(req, res) {
  try {
    const { blogId } = req.params;
    const row = await findBlogPostById(blogId);
    if (!row) return res.status(404).json({ ok: false, message: 'Blog post not found.' });

    const body = req.body || {};
    const updates = {};

    if (typeof body.title === 'string' && body.title.trim()) {
      updates.title = body.title.trim();
    }
    if (typeof body.excerpt === 'string') {
      updates.excerpt = body.excerpt.trim();
    }
    if (typeof body.content === 'string' && body.content.trim()) {
      updates.content = body.content.trim();
    }
    if (typeof body.coverImageUrl === 'string') {
      updates.coverImageUrl = body.coverImageUrl.trim();
    }
    if (typeof body.authorName === 'string') {
      updates.authorName = body.authorName.trim();
    }
    if (typeof body.seoTitle === 'string') {
      updates.seoTitle = body.seoTitle.trim();
    }
    if (typeof body.seoDescription === 'string') {
      updates.seoDescription = body.seoDescription.trim();
    }
    if (body.seoKeywords !== undefined) {
      updates.seoKeywords = normalizeKeywords(body.seoKeywords);
    }

    if (body.status === 'draft' || body.status === 'published') {
      updates.status = body.status;
      updates.publishedAt = body.status === 'published'
        ? (body.publishedAt ? new Date(body.publishedAt) : row.publishedAt || new Date())
        : null;
    } else if (body.publishedAt) {
      updates.publishedAt = new Date(body.publishedAt);
    }

    if (typeof body.slug === 'string' && body.slug.trim()) {
      const preferredSlug = slugify(body.slug);
      if (!preferredSlug) {
        return res.status(400).json({ ok: false, message: 'Slug format is invalid.' });
      }
      updates.slug = await ensureUniqueSlug(preferredSlug, row.id);
    } else if (updates.title && updates.title !== row.title) {
      const preferredSlug = slugify(String(updates.title));
      updates.slug = await ensureUniqueSlug(preferredSlug, row.id);
    }

    if (!Object.keys(updates).length) {
      return res.status(200).json({ ok: true, data: row, message: 'No changes applied.' });
    }
    const updated = await updateBlogPostById(blogId, updates);
    return res.status(200).json({ ok: true, data: updated, message: 'Blog post updated.' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to update blog post.'
    });
  }
}

export async function deleteAdminBlog(req, res) {
  try {
    const { blogId } = req.params;
    const deleted = await deleteBlogPostById(blogId);
    if (!deleted) return res.status(404).json({ ok: false, message: 'Blog post not found.' });
    return res.status(200).json({ ok: true, message: 'Blog post deleted.' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to delete blog post.'
    });
  }
}
