import { Router } from 'express';
import {
  deleteAdminEmployee,
  deleteAdminEmployeeTask,
  deleteAdminUser,
  downloadAdminEmployeeMonthlyReport,
  getAdminEmployees,
  getAdminEmployeeTasks,
  getAdminOverview,
  getAdminUsers,
  patchAdminEmployee,
  patchAdminEmployeeTask,
  patchAdminUserRole,
  patchAdminUserCreatorRequest,
  patchAdminUserStatus,
  postAdminEmployee,
  postAdminEmployeeTask,
  postAdminUserRevokeSession,
} from '../controllers/adminController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const adminRoutes = Router();

adminRoutes.get('/admin/overview', requireAuth, requireAdmin, getAdminOverview);
adminRoutes.get('/admin/users', requireAuth, requireAdmin, getAdminUsers);
adminRoutes.get('/admin/employees', requireAuth, requireAdmin, getAdminEmployees);
adminRoutes.post('/admin/employees', requireAuth, requireAdmin, postAdminEmployee);
adminRoutes.patch('/admin/employees/:employeeId', requireAuth, requireAdmin, patchAdminEmployee);
adminRoutes.delete('/admin/employees/:employeeId', requireAuth, requireAdmin, deleteAdminEmployee);
adminRoutes.get('/admin/employee-tasks', requireAuth, requireAdmin, getAdminEmployeeTasks);
adminRoutes.get(
  '/admin/employee-tasks/monthly-report',
  requireAuth,
  requireAdmin,
  downloadAdminEmployeeMonthlyReport,
);
adminRoutes.post('/admin/employee-tasks', requireAuth, requireAdmin, postAdminEmployeeTask);
adminRoutes.patch('/admin/employee-tasks/:taskId', requireAuth, requireAdmin, patchAdminEmployeeTask);
adminRoutes.delete('/admin/employee-tasks/:taskId', requireAuth, requireAdmin, deleteAdminEmployeeTask);
adminRoutes.patch('/admin/users/:userId/role', requireAuth, requireAdmin, patchAdminUserRole);
adminRoutes.patch('/admin/users/:userId/creator-request', requireAuth, requireAdmin, patchAdminUserCreatorRequest);
adminRoutes.patch('/admin/users/:userId/status', requireAuth, requireAdmin, patchAdminUserStatus);
adminRoutes.post(
  '/admin/users/:userId/revoke-session',
  requireAuth,
  requireAdmin,
  postAdminUserRevokeSession,
);
adminRoutes.delete('/admin/users/:userId', requireAuth, requireAdmin, deleteAdminUser);

export default adminRoutes;

