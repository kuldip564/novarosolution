import {
  addCommentToCreatorContent,
  createCreatorContent,
  deleteCreatorContentById,
  findCreatorContentById,
  listAllCreatorContent,
  listCreatorContentByCreatorId,
  toggleLikeCreatorContent,
  updateCreatorContentById,
} from '../models/creatorContentModel.js';
import { findUserById } from '../models/userModel.js';
import { uploadMediaDataUrl } from '../services/cloudinaryService.js';

export async function getMyCreatorContent(req, res) {
  try {
    const rows = await listCreatorContentByCreatorId(req.auth.userId);
    return res.status(200).json({ ok: true, data: rows });
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
    return res.status(200).json({ ok: true, message: 'Content deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Unable to delete content.' });
  }
}

export async function getAdminCreatorContent(req, res) {
  try {
    const [rows] = await Promise.all([listAllCreatorContent()]);
    const withCreator = await Promise.all(
      rows.map(async (row) => {
        const user = await findUserById(row.creatorId);
        return {
          ...row,
          creatorName: user?.name || 'Unknown',
          creatorEmail: user?.email || '',
        };
      }),
    );
    return res.status(200).json({ ok: true, data: withCreator });
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
    const rows = await listAllCreatorContent();
    const withCreator = await Promise.all(
      rows.map(async (row) => {
        const user = await findUserById(row.creatorId);
        return {
          ...row,
          creatorName: user?.name || 'Unknown Creator',
        };
      }),
    );
    return res.status(200).json({ ok: true, data: withCreator });
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
    return res.status(200).json({ ok: true, message: 'Comment added successfully.', data: updated });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Unable to add comment.' });
  }
}
