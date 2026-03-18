import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import contentRoutes from './contentRoutes.js';
import contactRoutes from './contactRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import projectChatRoutes from './projectChatRoutes.js';
import employeeTaskRoutes from './employeeTaskRoutes.js';
import creatorRoutes from './creatorRoutes.js';

const apiRoutes = Router();

apiRoutes.use(healthRoutes);
apiRoutes.use(contentRoutes);
apiRoutes.use(contactRoutes);
apiRoutes.use(authRoutes);
apiRoutes.use(adminRoutes);
apiRoutes.use(appointmentRoutes);
apiRoutes.use(projectChatRoutes);
apiRoutes.use(employeeTaskRoutes);
apiRoutes.use(creatorRoutes);

export default apiRoutes;

