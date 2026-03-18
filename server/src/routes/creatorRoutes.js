import { Router } from 'express';
import {
  getAdminCreatorContent,
  getMyCreatorContent,
  getPublicCreatorFeed,
  postMyCreatorContent,
} from '../controllers/creatorController.js';
import { requireAdmin, requireAuth, requireCreator } from '../middleware/authMiddleware.js';

const creatorRoutes = Router();

creatorRoutes.get('/creator/content', requireAuth, requireCreator, getMyCreatorContent);
creatorRoutes.post('/creator/content', requireAuth, requireCreator, postMyCreatorContent);
creatorRoutes.get('/admin/creator-content', requireAuth, requireAdmin, getAdminCreatorContent);
creatorRoutes.get('/creator/feed', getPublicCreatorFeed);

export default creatorRoutes;
