import defaultSiteContent from '../config/siteContent.js';
import { getSiteContentRow, upsertSiteContent } from '../models/siteContentModel.js';

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
    await upsertSiteContent(content);
    return getSiteContent();
  } catch (error) {
    throw new Error(`Unable to save site content: ${error?.message || 'database unavailable'}`);
  }
}


