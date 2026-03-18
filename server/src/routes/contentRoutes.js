import { Router } from 'express';
import {
  getSiteContentData,
  updateSiteContentData,
} from '../controllers/contentController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const contentRoutes = Router();

contentRoutes.get('/site-content', getSiteContentData);
contentRoutes.put('/site-content', requireAuth, requireAdmin, updateSiteContentData);

export default contentRoutes;

