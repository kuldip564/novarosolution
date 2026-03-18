import { Router } from 'express';
import {
  getContactSubmissions,
  postContactSubmission,
} from '../controllers/contactController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const contactRoutes = Router();

contactRoutes.get('/contact-submissions', requireAuth, requireAdmin, getContactSubmissions);
contactRoutes.post('/contact', requireAuth, postContactSubmission);

export default contactRoutes;

