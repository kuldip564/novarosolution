import {
  listContactSubmissions,
  createContactSubmission,
} from '../services/contactService.js';
import { getSiteContent } from '../services/siteContentService.js';
import { validateContactPayload } from '../utils/validators.js';

export async function getContactSubmissions(req, res) {
  try {
    const submissions = await listContactSubmissions();
    return res.status(200).json({ ok: true, data: submissions });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to fetch contact submissions.',
      error: error.message,
    });
  }
}

export async function postContactSubmission(req, res) {
  try {
    const content = await getSiteContent();
    const maintenanceMode = content?.systemSettings?.maintenanceMode ?? false;
    const allowContactSubmissions = content?.systemSettings?.allowContactSubmissions ?? true;
    if (maintenanceMode) {
      return res.status(503).json({
        ok: false,
        message:
          content?.systemSettings?.maintenanceMessage ||
          'Service is temporarily unavailable due to maintenance.',
      });
    }
    if (!allowContactSubmissions) {
      return res.status(403).json({
        ok: false,
        message: 'Contact form submissions are currently disabled by admin.',
      });
    }

    const validationMessage = validateContactPayload(req.body);
    if (validationMessage) {
      return res.status(400).json({
        ok: false,
        message: validationMessage,
      });
    }

    await createContactSubmission(req.body);
    return res.status(201).json({
      ok: true,
      message: 'Thanks! Your message has been sent successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong. Please try again.',
      error: error.message,
    });
  }
}

