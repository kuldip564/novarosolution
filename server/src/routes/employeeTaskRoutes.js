import { Router } from 'express';
import {
  deleteMyDailyTask,
  downloadMyMonthlyTaskReport,
  getMyDailyTasks,
  patchMyDailyTask,
  postMyDailyTask,
} from '../controllers/employeeTaskController.js';
import { requireAuth, requireEmployee } from '../middleware/authMiddleware.js';

const employeeTaskRoutes = Router();

employeeTaskRoutes.get('/employee/tasks', requireAuth, requireEmployee, getMyDailyTasks);
employeeTaskRoutes.post('/employee/tasks', requireAuth, requireEmployee, postMyDailyTask);
employeeTaskRoutes.patch('/employee/tasks/:taskId', requireAuth, requireEmployee, patchMyDailyTask);
employeeTaskRoutes.delete('/employee/tasks/:taskId', requireAuth, requireEmployee, deleteMyDailyTask);
employeeTaskRoutes.get(
  '/employee/tasks/monthly-report',
  requireAuth,
  requireEmployee,
  downloadMyMonthlyTaskReport,
);

export default employeeTaskRoutes;
