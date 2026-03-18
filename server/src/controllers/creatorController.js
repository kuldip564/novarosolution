import {
  createCreatorContent,
  listAllCreatorContent,
  listCreatorContentByCreatorId,
} from '../models/creatorContentModel.js';
import { findUserById } from '../models/userModel.js';
import { uploadMediaDataUrl } from '../services/cloudinaryService.js';

const ALLOWED_PLATFORMS = ['twitter', 'facebook', 'instagram'];

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
    const { title, platform, caption, mediaDataUrl, mediaUrl } = req.body ?? {};
    const trimmedTitle = String(title || '').trim();
    const normalizedPlatform = String(platform || '').trim().toLowerCase();
    if (!trimmedTitle) {
      return res.status(400).json({ ok: false, message: 'Title is required.' });
    }
    if (!ALLOWED_PLATFORMS.includes(normalizedPlatform)) {
      return res.status(400).json({
        ok: false,
        message: `Platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}`,
      });
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
      platform: normalizedPlatform,
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
