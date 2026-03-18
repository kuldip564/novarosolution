import { Router } from 'express';
import {
  getAdminCreatorContent,
  getMyCreatorContent,
  postMyCreatorContent,
} from '../controllers/creatorController.js';
import { requireAdmin, requireAuth, requireCreator } from '../middleware/authMiddleware.js';

const creatorRoutes = Router();

creatorRoutes.get('/creator/content', requireAuth, requireCreator, getMyCreatorContent);
creatorRoutes.post('/creator/content', requireAuth, requireCreator, postMyCreatorContent);
creatorRoutes.get('/admin/creator-content', requireAuth, requireAdmin, getAdminCreatorContent);

export default creatorRoutes;
