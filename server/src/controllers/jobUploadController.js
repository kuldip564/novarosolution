import { uploadApplicationDocumentDataUrl } from '../services/cloudinaryService.js';

/**
 * POST /api/me/application-documents
 * Body: { dataUrl: string, fileName?: string }
 * Returns { url } for use in job application payload (resumeUrl / additionalDocumentUrl).
 */
export async function postUploadApplicationDocument(req, res) {
  try {
    const { dataUrl } = req.body ?? {};
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ ok: false, message: 'dataUrl is required.' });
    }
    const url = await uploadApplicationDocumentDataUrl(dataUrl);
    return res.status(200).json({ ok: true, data: { url } });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error?.message || 'Unable to upload document.',
    });
  }
}
