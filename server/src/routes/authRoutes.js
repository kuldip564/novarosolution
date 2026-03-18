import { Router } from 'express';
import {
  login,
  me,
  requestMyCreatorAccess,
  register,
  updateMyPassword,
  updateMyProfile,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const authRoutes = Router();

authRoutes.post('/auth/register', register);
authRoutes.post('/auth/login', login);
authRoutes.get('/auth/me', requireAuth, me);
authRoutes.put('/auth/profile', requireAuth, updateMyProfile);
authRoutes.put('/auth/password', requireAuth, updateMyPassword);
authRoutes.post('/auth/creator-request', requireAuth, requestMyCreatorAccess);

export default authRoutes;

