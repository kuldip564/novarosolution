import { Router } from 'express';
import {
  getPublishedJobById,
  getPublishedJobs,
  getMyJobApplications,
  postJobApplication,
  postMarkJobApplicationRead,
} from '../controllers/jobController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const jobRoutes = Router();

jobRoutes.get('/jobs', getPublishedJobs);
jobRoutes.get('/jobs/:jobId', getPublishedJobById);
jobRoutes.post('/jobs/:jobId/apply', requireAuth, postJobApplication);
jobRoutes.get('/me/job-applications', requireAuth, getMyJobApplications);
jobRoutes.post('/me/job-applications/:applicationId/read', requireAuth, postMarkJobApplicationRead);

export default jobRoutes;
