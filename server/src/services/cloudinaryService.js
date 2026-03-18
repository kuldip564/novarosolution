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
