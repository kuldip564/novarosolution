import {
  countCreatorContent,
  addCommentToCreatorContent,
  createCreatorContent,
  deleteCreatorContentById,
  findCreatorContentById,
  listAllCreatorContent,
  listCreatorContentByCreatorId,
  toggleLikeCreatorContent,
  updateCreatorContentById,
} from '../models/creatorContentModel.js';
import { findUserById, findUsersByIds } from '../models/userModel.js';
import { uploadMediaDataUrl } from '../services/cloudinaryService.js';
import { deleteCacheByPrefix, getCache, setCache } from '../services/cacheService.js';
import { parsePagination } from '../utils/pagination.js';
import { verifyAuthToken } from '../utils/token.js';

const CREATOR_FEED_SORTS = new Set(['latest', 'popular', 'discussed']);

async function resolveOptionalViewer(req) {
  const authHeader = String(req.headers.authorization || '');
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const decoded = verifyAuthToken(token);
    const user = await findUserById(decoded.userId);
    if (!user || user.isActive === false) return null;
    const tokenVersion = Number(decoded.tokenVersion || 0);
    const currentTokenVersion = Number(user.tokenVersion || 0);
    if (tokenVersion !== currentTokenVersion) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getMyCreatorContent(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      listCreatorContentByCreatorId(req.auth.userId, { page, limit }),
      countCreatorContent({ creatorId: req.auth.userId })
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
      message: 'Unable to load creator content.',
      error: error.message,
    });
  }
}

export async function postMyCreatorContent(req, res) {
  try {
    const { title, caption, mediaDataUrl, mediaUrl } = req.body ?? {};
    const trimmedTitle = String(title || '').trim();
    if (!trimmedTitle) {
      return res.status(400).json({ ok: false, message: 'Title is required.' });
    }

    let resolvedMediaUrl = String(mediaUrl || '').trim();
    let resolvedMediaType = '';
    if (typeof mediaDataUrl === 'string' && mediaDataUrl.trim()) {
      const uploaded = await uploadMediaDataUrl(mediaDataUrl, {
        folder: 'novarosolution/creator-content',
        publicIdPrefix: `creator-${req.auth.userId}`,
      });
      resolvedMediaUrl = uploaded.mediaUrl;
      resolvedMediaType = uploaded.mediaType;
    } else if (resolvedMediaUrl) {
      resolvedMediaType = /\.(mp4|mov|avi|webm|mkv)$/i.test(resolvedMediaUrl) ? 'video' : 'image';
    }

    if (!resolvedMediaUrl || !resolvedMediaType) {
      return res.status(400).json({
        ok: false,
        message: 'Media is required. Upload an image/video or provide media URL.',
      });
    }

    const created = await createCreatorContent({
      creatorId: req.auth.userId,
      title: trimmedTitle,
      caption: String(caption || '').trim(),
      mediaUrl: resolvedMediaUrl,
      mediaType: resolvedMediaType,
      status: 'published',
    });
    await deleteCacheByPrefix('creator-feed:');
    return res.status(201).json({
      ok: true,
      message: 'Content uploaded successfully.',
      data: created,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to upload creator content.',
    });
  }
}

export async function patchMyCreatorContent(req, res) {
  try {
    const { contentId } = req.params;
    const row = await findCreatorContentById(contentId);
    if (!row) return res.status(404).json({ ok: false, message: 'Content not found.' });
    if (row.creatorId !== req.auth.userId && req.auth.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Forbidden. Cannot edit this content.' });
    }
    const { title, caption, mediaDataUrl, mediaUrl } = req.body ?? {};
    const updates = {};
    if (typeof title === 'string' && title.trim()) updates.title = title.trim();
    if (typeof caption === 'string') updates.caption = caption.trim();
    if (typeof mediaDataUrl === 'string' && mediaDataUrl.trim()) {
      const uploaded = await uploadMediaDataUrl(mediaDataUrl, {
        folder: 'novarosolution/creator-content',
        publicIdPrefix: `creator-${row.creatorId}`,
      });
      updates.mediaUrl = uploaded.mediaUrl;
      updates.mediaType = uploaded.mediaType;
    } else if (typeof mediaUrl === 'string' && mediaUrl.trim()) {
      updates.mediaUrl = mediaUrl.trim();
      updates.mediaType = /\.(mp4|mov|avi|webm|mkv)$/i.test(updates.mediaUrl) ? 'video' : 'image';
    }
    if (!Object.keys(updates).length) {
      return res.status(200).json({ ok: true, message: 'No changes applied.', data: row });
    }
    const updated = await updateCreatorContentById(contentId, updates);
    await deleteCacheByPrefix('creator-feed:');
    return res.status(200).json({ ok: true, message: 'Content updated successfully.', data: updated });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Unable to update content.' });
  }
}

export async function deleteMyCreatorContent(req, res) {
  try {
    const { contentId } = req.params;
    const row = await findCreatorContentById(contentId);
    if (!row) return res.status(404).json({ ok: false, message: 'Content not found.' });
    if (row.creatorId !== req.auth.userId && req.auth.role !== 'admin') {
      return res.status(403).json({ ok: false, message: 'Forbidden. Cannot delete this content.' });
    }
    await deleteCreatorContentById(contentId);
    await deleteCacheByPrefix('creator-feed:');
    return res.status(200).json({ ok: true, message: 'Content deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Unable to delete content.' });
  }
}

export async function getAdminCreatorContent(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      listAllCreatorContent({ page, limit }),
      countCreatorContent()
    ]);
    const creatorUsers = await findUsersByIds(rows.map((row) => row.creatorId), {
      projection: 'name email'
    });
    const userMap = new Map(creatorUsers.map((user) => [user.id, user]));
    const withCreator = rows.map((row) => ({
      ...row,
      creatorName: userMap.get(row.creatorId)?.name || 'Unknown',
      creatorEmail: userMap.get(row.creatorId)?.email || ''
    }));
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
    return res.status(200).json({
      ok: true,
      data: withCreator,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load creator content for admin.',
      error: error.message,
    });
  }
}

export async function getPublicCreatorFeed(req, res) {
  try {
    const { page, limit } = parsePagination(req.query, { page: 1, limit: 12 });
    const sortBy = CREATOR_FEED_SORTS.has(String(req.query?.sort || ''))
      ? String(req.query.sort)
      : 'latest';
    const summary = String(req.query?.view || 'summary') !== 'full';
    const rawCommentsPreviewLimit = Number(req.query?.commentsPreviewLimit || 3);
    const commentsPreviewLimit =
      Number.isFinite(rawCommentsPreviewLimit) && rawCommentsPreviewLimit >= 0
        ? Math.min(Math.max(Math.trunc(rawCommentsPreviewLimit), 0), 10)
        : 3;
    const viewer = await resolveOptionalViewer(req);
    const viewerScope = viewer?.id || 'anon';
    const cacheKey = [
      'creator-feed',
      `page:${page}`,
      `limit:${limit}`,
      `sort:${sortBy}`,
      `view:${summary ? 'summary' : 'full'}`,
      `commentsPreview:${commentsPreviewLimit}`,
      `viewer:${viewerScope}`
    ].join(':');
    const cached = await getCache(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ ok: true, data: cached.items || [], pagination: cached.pagination || null });
    }

    const [rows, total] = await Promise.all([
      listAllCreatorContent({
        page,
        limit,
        sortBy,
        summary,
        status: 'published',
        viewerId: viewer?.id || '',
        commentsPreviewLimit
      }),
      countCreatorContent({ status: 'published' })
    ]);
    const creatorUsers = await findUsersByIds(rows.map((row) => row.creatorId), {
      projection: 'name'
    });
    const userMap = new Map(creatorUsers.map((user) => [user.id, user]));
    const withCreator = rows.map((row) => ({
      ...row,
      creatorName: userMap.get(row.creatorId)?.name || 'Unknown Creator'
    }));
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
    const payload = {
      items: withCreator,
      pagination: { page, limit, total, totalPages, hasMore: totalPages > page }
    };
    await setCache(cacheKey, payload, 60);
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, data: payload.items, pagination: payload.pagination });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load public creator feed.',
      error: error.message,
    });
  }
}

export async function postCreatorFeedLike(req, res) {
  try {
    const { contentId } = req.params;
    const updated = await toggleLikeCreatorContent(contentId, req.auth.userId);
    if (!updated) return res.status(404).json({ ok: false, message: 'Content not found.' });
    await deleteCacheByPrefix('creator-feed:');
    return res.status(200).json({ ok: true, message: 'Like updated.', data: updated });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Unable to update like.' });
  }
}

export async function postCreatorFeedComment(req, res) {
  try {
    const { contentId } = req.params;
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ ok: false, message: 'Comment text is required.' });
    const user = await findUserById(req.auth.userId);
    const updated = await addCommentToCreatorContent(contentId, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: req.auth.userId,
      userName: user?.name || 'User',
      text,
      createdAt: new Date(),
    });
    if (!updated) return res.status(404).json({ ok: false, message: 'Content not found.' });
    await deleteCacheByPrefix('creator-feed:');
    return res.status(200).json({ ok: true, message: 'Comment added successfully.', data: updated });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Unable to add comment.' });
  }
}
