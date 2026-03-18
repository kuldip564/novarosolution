import defaultSiteContent from '../config/siteContent.js';
import { getSiteContentRow, upsertSiteContent } from '../models/siteContentModel.js';
import { isImageDataUrl, uploadImageDataUrl } from './cloudinaryService.js';

async function replaceImageDataUrls(value, path = []) {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item, index) => replaceImageDataUrls(item, [...path, index])));
  }

  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, nestedValue]) => {
        const resolved = await replaceImageDataUrls(nestedValue, [...path, key]);
        return [key, resolved];
      }),
    );
    return Object.fromEntries(entries);
  }

  if (typeof value === 'string' && isImageDataUrl(value)) {
    const prefix = path.length ? path.join('-').replace(/[^a-zA-Z0-9-]/g, '-') : 'content-image';
    return uploadImageDataUrl(value, {
      folder: 'novarosolution/site-content',
      publicIdPrefix: prefix,
    });
  }

  return value;
}

export async function getSiteContent() {
  try {
    const row = await getSiteContentRow();

    if (!row?.content) {
      await upsertSiteContent(defaultSiteContent);
      return defaultSiteContent;
    }
    return row.content;
  } catch (error) {
    console.warn(`[site-content] Using default content due to DB error: ${error?.message || 'unknown error'}`);
    return defaultSiteContent;
  }
}

export async function updateSiteContent(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error('Invalid content payload.');
  }
  try {
    const contentWithUploadedImages = await replaceImageDataUrls(content);
    await upsertSiteContent(contentWithUploadedImages);
    return getSiteContent();
  } catch (error) {
    throw new Error(`Unable to save site content: ${error?.message || 'database unavailable'}`);
  }
}


