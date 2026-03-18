import { getUserById } from '../services/authService.js';
import { getSiteContent } from '../services/siteContentService.js';
import {
  deleteProjectChatByAdmin,
  listAdminProjectMessagesByUserId,
  listAdminProjectThreads,
  listUserProjectMessages,
  requestDeleteMyProjectChat,
  sendAutoAdminReplyIfEnabled,
  sendAdminProjectMessage,
  sendUserProjectMessage,
} from '../services/projectChatService.js';

function validateMessageInput(body) {
  const message = body?.message;
  if (!message || !String(message).trim()) {
    return 'Message is required.';
  }
  return '';
}

export async function getMyProjectMessages(req, res) {
  try {
    const messages = await listUserProjectMessages(req.auth.userId);
    return res.status(200).json({ ok: true, data: messages });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || 'Unable to fetch messages.',
    });
  }
}

export async function postMyProjectMessage(req, res) {
  try {
    const content = await getSiteContent();
    const maintenanceMode = content?.systemSettings?.maintenanceMode ?? false;
    if (maintenanceMode) {
      return res.status(503).json({
        ok: false,
        message:
          content?.systemSettings?.maintenanceMessage ||
          'Service is temporarily unavailable due to maintenance.',
      });
    }
    const allowProjectChat = content?.chatSettings?.allowProjectChat ?? true;
    if (!allowProjectChat) {
      return res.status(403).json({
        ok: false,
        message: 'Project chat is currently disabled by admin.',
      });
    }

    const validationError = validateMessageInput(req.body);
    if (validationError) {
      return res.status(400).json({ ok: false, message: validationError });
    }

    const user = await getUserById(req.auth.userId);
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found.' });
    }

    const message = await sendUserProjectMessage(user, String(req.body.message));
    try {
      await sendAutoAdminReplyIfEnabled(req.auth.userId, String(req.body.message));
    } catch {
      // Do not fail user send flow if auto-reply fails.
    }
    return res.status(201).json({ ok: true, data: message });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to send message.',
    });
  }
}

export async function deleteMyProjectChat(req, res) {
  try {
    const result = await requestDeleteMyProjectChat(req.auth.userId);
    return res.status(200).json({
      ok: true,
      message: 'Delete request sent to admin.',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to request chat deletion.',
    });
  }
}

export async function getAdminProjectThreads(req, res) {
  try {
    const threads = await listAdminProjectThreads();
    return res.status(200).json({ ok: true, data: threads });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || 'Unable to fetch chat threads.',
    });
  }
}

export async function getAdminProjectMessages(req, res) {
  try {
    const messages = await listAdminProjectMessagesByUserId(req.params.userId);
    return res.status(200).json({ ok: true, data: messages });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to fetch chat messages.',
    });
  }
}

export async function postAdminProjectMessage(req, res) {
  try {
    const validationError = validateMessageInput(req.body);
    if (validationError) {
      return res.status(400).json({ ok: false, message: validationError });
    }

    const adminUser = await getUserById(req.auth.userId);
    if (!adminUser) {
      return res.status(404).json({ ok: false, message: 'Admin not found.' });
    }

    const message = await sendAdminProjectMessage(
      adminUser,
      req.params.userId,
      String(req.body.message),
    );
    return res.status(201).json({ ok: true, data: message });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to send admin message.',
    });
  }
}

export async function deleteAdminProjectThread(req, res) {
  try {
    const deletedCount = await deleteProjectChatByAdmin(req.params.userId);
    return res.status(200).json({
      ok: true,
      message: 'Chat thread deleted permanently.',
      data: { deletedCount },
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to delete chat thread.',
    });
  }
}

