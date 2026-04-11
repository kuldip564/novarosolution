import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../config/env.js';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function isImageDataUrl(value) {
  if (typeof value !== 'string') return false;
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}

export function isVideoDataUrl(value) {
  if (typeof value !== 'string') return false;
  return /^data:video\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}

export function getDataUrlMediaType(value) {
  if (isImageDataUrl(value)) return 'image';
  if (isVideoDataUrl(value)) return 'video';
  return '';
}

export async function uploadImageDataUrl(dataUrl, { folder = 'novarosolution/uploads', publicIdPrefix = 'image' } = {}) {
  if (!isImageDataUrl(dataUrl)) {
    throw new Error('Invalid image data URL.');
  }
  ensureConfigured();
  const publicId = `${publicIdPrefix}-${Date.now()}`;
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });
  return result.secure_url;
}

const APPLICATION_DOC_DATA_URL =
  /^data:(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document);base64,/i;

/** PDF or Word (.doc, .docx) for job applications — uploaded as raw assets on Cloudinary. */
export function isApplicationDocumentDataUrl(value) {
  if (typeof value !== 'string') return false;
  if (!APPLICATION_DOC_DATA_URL.test(value)) return false;
  if (value.length > 14_000_000) return false;
  return true;
}

export async function uploadApplicationDocumentDataUrl(
  dataUrl,
  { folder = 'novarosolution/job-documents', publicIdPrefix = 'doc' } = {},
) {
  if (!isApplicationDocumentDataUrl(dataUrl)) {
    throw new Error('Invalid document. Use PDF or Word (.doc, .docx), max ~10MB.');
  }
  ensureConfigured();
  const publicId = `${publicIdPrefix}-${Date.now()}`;
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId,
    resource_type: 'raw',
  });
  return result.secure_url;
}

export async function uploadMediaDataUrl(
  dataUrl,
  { folder = 'novarosolution/uploads', publicIdPrefix = 'media' } = {},
) {
  const mediaType = getDataUrlMediaType(dataUrl);
  if (!mediaType) {
    throw new Error('Invalid media data URL. Upload image or video only.');
  }
  ensureConfigured();
  const publicId = `${publicIdPrefix}-${Date.now()}`;
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: mediaType === 'video' ? 'video' : 'image',
  });
  return {
    mediaUrl: result.secure_url,
    mediaType,
  };
}
