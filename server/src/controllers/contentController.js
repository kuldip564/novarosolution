import { getSiteContent, updateSiteContent } from '../services/siteContentService.js';

export async function getSiteContentData(req, res) {
  try {
    const content = await getSiteContent();
    res.status(200).json({ ok: true, data: content });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Unable to load site content.',
      error: error.message,
    });
  }
}

export async function updateSiteContentData(req, res) {
  try {
    const updatedContent = await updateSiteContent(req.body);
    res.status(200).json({
      ok: true,
      message: 'Site content updated.',
      data: updatedContent,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message || 'Unable to update site content.',
    });
  }
}

