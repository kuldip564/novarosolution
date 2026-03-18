import { Router } from 'express';
import {
  deleteMyCreatorContent,
  getAdminCreatorContent,
  getMyCreatorContent,
  getPublicCreatorFeed,
  patchMyCreatorContent,
  postCreatorFeedComment,
  postCreatorFeedLike,
  postMyCreatorContent,
} from '../controllers/creatorController.js';
import { requireAdmin, requireAuth, requireCreator } from '../middleware/authMiddleware.js';

const creatorRoutes = Router();

creatorRoutes.get('/creator/content', requireAuth, requireCreator, getMyCreatorContent);
creatorRoutes.post('/creator/content', requireAuth, requireCreator, postMyCreatorContent);
creatorRoutes.patch('/creator/content/:contentId', requireAuth, requireCreator, patchMyCreatorContent);
creatorRoutes.delete('/creator/content/:contentId', requireAuth, requireCreator, deleteMyCreatorContent);
creatorRoutes.get('/admin/creator-content', requireAuth, requireAdmin, getAdminCreatorContent);
creatorRoutes.get('/creator/feed', getPublicCreatorFeed);
creatorRoutes.post('/creator/feed/:contentId/like', requireAuth, postCreatorFeedLike);
creatorRoutes.post('/creator/feed/:contentId/comment', requireAuth, postCreatorFeedComment);

export default creatorRoutes;
