import { Router } from 'express';
import {
  login,
  me,
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

export default authRoutes;

