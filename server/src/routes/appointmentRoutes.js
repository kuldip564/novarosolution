import { Router } from 'express';
import {
  getServiceAppointments,
  postServiceAppointment,
} from '../controllers/appointmentController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const appointmentRoutes = Router();

appointmentRoutes.post('/appointments', postServiceAppointment);
appointmentRoutes.get('/appointments', requireAuth, requireAdmin, getServiceAppointments);

export default appointmentRoutes;

