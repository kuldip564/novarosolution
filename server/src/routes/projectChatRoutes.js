import { Router } from 'express';
import {
  deleteAdminProjectThread,
  deleteMyProjectChat,
  getAdminProjectMessages,
  getAdminProjectThreads,
  getMyProjectMessages,
  postAdminProjectMessage,
  postMyProjectMessage,
} from '../controllers/projectChatController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const projectChatRoutes = Router();

projectChatRoutes.get('/chat/my', requireAuth, getMyProjectMessages);
projectChatRoutes.post('/chat/my', requireAuth, postMyProjectMessage);
projectChatRoutes.delete('/chat/my', requireAuth, deleteMyProjectChat);

projectChatRoutes.get('/admin/chats', requireAuth, requireAdmin, getAdminProjectThreads);
projectChatRoutes.get('/admin/chats/:userId', requireAuth, requireAdmin, getAdminProjectMessages);
projectChatRoutes.post('/admin/chats/:userId', requireAuth, requireAdmin, postAdminProjectMessage);
projectChatRoutes.delete('/admin/chats/:userId', requireAuth, requireAdmin, deleteAdminProjectThread);

export default projectChatRoutes;

