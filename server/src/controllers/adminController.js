import bcrypt from 'bcryptjs';
import XLSX from 'xlsx';
import { countContactSubmissions } from '../models/contactSubmissionModel.js';
import {
  countDailyTasks,
  createDailyTask,
  deleteDailyTaskById,
  listAllDailyTasks,
  updateDailyTaskById,
} from '../models/dailyTaskModel.js';
import {
  createEmployee,
  deleteEmployeeById,
  findEmployeeByEmail,
  findEmployeeById,
  listEmployees,
  updateEmployeeById,
} from '../models/employeeModel.js';
import { countServiceAppointments } from '../models/serviceAppointmentModel.js';
import {
  countActiveUsersByRole,
  countUsers,
  countUsersWithFilter,
  countUsersByRole,
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  incrementUserTokenVersionById,
  listUsers,
  updateUserById,
} from '../models/userModel.js';
import { deleteCacheByPrefix, getCache, setCache } from '../services/cacheService.js';
import { parsePagination } from '../utils/pagination.js';

export async function getAdminOverview(req, res) {
  try {
    const cacheKey = 'overview:admin';
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ ok: true, data: cached });
    const [totalUsers, totalAdmins, totalMembers, totalEmployees, totalCreators, totalSubmissions, totalAppointments, pendingCreatorRequests] =
      await Promise.all([
      countUsers(),
      countUsersByRole('admin'),
      countUsersByRole('user'),
      countUsersByRole('employee'),
      countUsersByRole('creator'),
      countContactSubmissions(),
      countServiceAppointments(),
      countUsersWithFilter({ creatorRequestStatus: 'pending' }),
    ]);
    const payload = {
      totalUsers,
      totalAdmins,
      totalMembers,
      totalEmployees,
      totalCreators,
      pendingCreatorRequests,
      totalSubmissions,
      totalAppointments,
    };
    await setCache(cacheKey, payload, 45);

    return res.status(200).json({
      ok: true,
      data: payload,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to load admin overview.', error: error.message });
  }
}

export async function getAdminEmployees(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [employeeProfiles, users, total] = await Promise.all([
      listEmployees({ page, limit }),
      listUsers({ page, limit, projection: 'name email role isActive createdAt', filter: { role: 'employee' } }),
      countUsersWithFilter({ role: 'employee' }),
    ]);
    const employeeUsers = users.filter((item) => item.role === 'employee');
    const profileByUserId = new Map(employeeProfiles.filter((item) => item.userId).map((item) => [item.userId, item]));
    const profileByEmail = new Map(employeeProfiles.map((item) => [String(item.email || '').toLowerCase(), item]));

    const employees = employeeUsers.map((user) => {
      const profile = profileByUserId.get(user.id) || profileByEmail.get(String(user.email || '').toLowerCase()) || null;
      return {
        id: profile?.id || user.id,
        userId: user.id,
        name: profile?.name || user.name,
        email: profile?.email || user.email,
        role: profile?.role || 'Employee',
        department: profile?.department || '',
        phone: profile?.phone || '',
        joinedAt: profile?.joinedAt || user.createdAt,
        notes: profile?.notes || '',
        isActive: user.isActive,
        createdAt: profile?.createdAt || user.createdAt,
        updatedAt: profile?.updatedAt || user.createdAt,
      };
    });
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;

    return res.status(200).json({
      ok: true,
      data: employees,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to load employees.', error: error.message });
  }
}

export async function postAdminEmployee(req, res) {
  try {
    const { name, email, password, role, department, phone, joinedAt, notes, isActive } = req.body ?? {};
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const trimmedRole = String(role || 'Employee').trim();

    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({ ok: false, message: 'Name and email are required.' });
    }

    const existingEmployee = await findEmployeeByEmail(trimmedEmail);
    if (existingEmployee) {
      return res.status(400).json({ ok: false, message: 'Employee email already exists.' });
    }

    let user = await findUserByEmail(trimmedEmail);
    if (!user) {
      const rawPassword = String(password || '').trim();
      if (rawPassword.length < 6) {
        return res.status(400).json({ ok: false, message: 'Password (min 6 chars) is required.' });
      }
      const hashed = await bcrypt.hash(rawPassword, 10);
      user = await createUser({
        name: trimmedName,
        email: trimmedEmail,
        password: hashed,
        role: 'employee',
      });
    } else {
      const updates = {
        name: trimmedName || user.name,
        role: 'employee',
        isActive: typeof isActive === 'boolean' ? isActive : user.isActive !== false,
      };
      const rawPassword = String(password || '').trim();
      if (rawPassword) {
        if (rawPassword.length < 6) {
          return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' });
        }
        updates.password = await bcrypt.hash(rawPassword, 10);
      }
      user = await updateUserById(user.id, updates);
    }

    const employee = await createEmployee({
      userId: user.id,
      name: trimmedName,
      email: trimmedEmail,
      role: trimmedRole,
      department: String(department || '').trim(),
      phone: String(phone || '').trim(),
      notes: String(notes || '').trim(),
      isActive: typeof isActive === 'boolean' ? isActive : true,
      joinedAt: joinedAt ? new Date(joinedAt) : new Date(),
    });
    await deleteCacheByPrefix('overview:');

    return res.status(201).json({ ok: true, message: 'Employee added successfully.', data: employee });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to add employee.', error: error.message });
  }
}

export async function patchAdminEmployee(req, res) {
  try {
    const { employeeId } = req.params;
    const existingEmployee = await findEmployeeById(employeeId);
    if (!existingEmployee) return res.status(404).json({ ok: false, message: 'Employee not found.' });

    const { name, email, password, role, department, phone, joinedAt, notes, isActive } = req.body ?? {};
    const updates = {};

    if (typeof name === 'string') updates.name = name.trim();
    if (typeof role === 'string') updates.role = role.trim();
    if (typeof department === 'string') updates.department = department.trim();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof notes === 'string') updates.notes = notes.trim();
    if (typeof isActive === 'boolean') updates.isActive = isActive;
    if (joinedAt) updates.joinedAt = new Date(joinedAt);

    let mappedUser = null;
    if (existingEmployee.userId) mappedUser = await findUserById(existingEmployee.userId);
    if (!mappedUser && existingEmployee.email) mappedUser = await findUserByEmail(existingEmployee.email);

    if (typeof email === 'string') {
      const normalized = email.trim().toLowerCase();
      if (normalized) updates.email = normalized;
    }

    if (mappedUser) {
      const userUpdates = {
        name: updates.name || mappedUser.name,
        email: updates.email || mappedUser.email,
        role: 'employee',
        isActive: typeof updates.isActive === 'boolean' ? updates.isActive : mappedUser.isActive !== false,
      };
      const rawPassword = String(password || '').trim();
      if (rawPassword) {
        if (rawPassword.length < 6) {
          return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' });
        }
        userUpdates.password = await bcrypt.hash(rawPassword, 10);
      }
      const updatedUser = await updateUserById(mappedUser.id, userUpdates);
      updates.userId = updatedUser.id;
    }

    const updated = await updateEmployeeById(employeeId, updates);
    if (!updated) return res.status(404).json({ ok: false, message: 'Employee not found.' });
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, message: 'Employee updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to update employee.', error: error.message });
  }
}

export async function deleteAdminEmployee(req, res) {
  try {
    const { employeeId } = req.params;
    const existing = await findEmployeeById(employeeId);
    const deleted = await deleteEmployeeById(employeeId);
    if (!deleted) return res.status(404).json({ ok: false, message: 'Employee not found.' });

    let mappedUser = null;
    if (existing?.userId) mappedUser = await findUserById(existing.userId);
    if (!mappedUser && existing?.email) mappedUser = await findUserByEmail(existing.email);
    if (mappedUser && mappedUser.role === 'employee') {
      await updateUserById(mappedUser.id, { role: 'user' });
    }
    await deleteCacheByPrefix('overview:');

    return res.status(200).json({ ok: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to delete employee.', error: error.message });
  }
}

export async function getAdminEmployeeTasks(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [tasks, users, total] = await Promise.all([
      listAllDailyTasks({ page, limit }),
      listUsers({ projection: 'name email' }),
      countDailyTasks(),
    ]);
    const userMap = new Map(users.map((u) => [u.id, u]));
    const rows = tasks.map((task) => ({
      ...task,
      employeeName: userMap.get(task.employeeId)?.name || 'Unknown Employee',
      employeeEmail: userMap.get(task.employeeId)?.email || '',
      assignedByName: userMap.get(task.assignedById)?.name || 'Admin',
    }));
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
    return res.status(200).json({
      ok: true,
      data: rows,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to load employee tasks.', error: error.message });
  }
}

export async function postAdminEmployeeTask(req, res) {
  try {
    const { employeeId, title, plannedTask, adminNote, workDate, status } = req.body ?? {};
    const targetUser = await findUserById(employeeId);
    if (!targetUser || targetUser.role !== 'employee') {
      return res.status(400).json({ ok: false, message: 'Valid employee user is required.' });
    }
    const trimmedTitle = String(title || '').trim();
    if (!trimmedTitle) return res.status(400).json({ ok: false, message: 'Task title is required.' });

    const payload = {
      employeeId,
      assignedById: req.auth.userId,
      title: trimmedTitle,
      plannedTask: String(plannedTask || '').trim(),
      adminNote: String(adminNote || '').trim(),
      status: ['pending', 'in_progress', 'completed'].includes(String(status)) ? String(status) : 'pending',
      workDate: workDate ? new Date(workDate) : new Date(),
      jobStartAt: new Date(),
      jobEndAt: status === 'completed' ? new Date() : null,
      approvalRequested: false,
      approvalRejected: false,
      approvedAt: status === 'completed' ? new Date() : null,
      approvedById: status === 'completed' ? req.auth.userId : null,
    };

    const task = await createDailyTask(payload);
    await deleteCacheByPrefix('overview:');
    return res.status(201).json({ ok: true, message: 'Task assigned successfully.', data: task });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to assign task.', error: error.message });
  }
}

export async function patchAdminEmployeeTask(req, res) {
  try {
    const { taskId } = req.params;
    const { title, plannedTask, adminNote, workDate, status, employeeId, approveTask } = req.body ?? {};
    const updates = {};
    if (typeof title === 'string') updates.title = title.trim();
    if (typeof plannedTask === 'string') updates.plannedTask = plannedTask.trim();
    if (typeof adminNote === 'string') updates.adminNote = adminNote.trim();
    if (typeof status === 'string' && ['pending', 'in_progress', 'completed'].includes(status)) {
      updates.status = status;
      updates.completedAt = status === 'completed' ? new Date() : null;
      updates.jobEndAt = status === 'completed' ? new Date() : null;
      updates.approvalRequested = false;
      updates.approvalRejected = false;
      updates.approvedAt = status === 'completed' ? new Date() : null;
      updates.approvedById = status === 'completed' ? req.auth.userId : null;
    }
    if (approveTask === true) {
      updates.status = 'completed';
      updates.completedAt = new Date();
      updates.jobEndAt = new Date();
      updates.approvalRequested = false;
      updates.approvalRejected = false;
      updates.approvedAt = new Date();
      updates.approvedById = req.auth.userId;
    }
    if (approveTask === false) {
      updates.status = 'pending';
      updates.completedAt = null;
      updates.jobEndAt = null;
      updates.approvalRequested = false;
      updates.approvalRejected = true;
      updates.approvedAt = null;
      updates.approvedById = null;
    }
    if (workDate) updates.workDate = new Date(workDate);
    if (typeof employeeId === 'string' && employeeId.trim()) {
      const targetUser = await findUserById(employeeId);
      if (!targetUser || targetUser.role !== 'employee') {
        return res.status(400).json({ ok: false, message: 'Valid employee user is required.' });
      }
      updates.employeeId = employeeId;
    }

    const updated = await updateDailyTaskById(taskId, updates);
    if (!updated) return res.status(404).json({ ok: false, message: 'Task not found.' });
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, message: 'Task updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to update task.', error: error.message });
  }
}

export async function deleteAdminEmployeeTask(req, res) {
  try {
    const { taskId } = req.params;
    const deleted = await deleteDailyTaskById(taskId);
    if (!deleted) return res.status(404).json({ ok: false, message: 'Task not found.' });
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, message: 'Task deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to delete task.', error: error.message });
  }
}

export async function downloadAdminEmployeeMonthlyReport(req, res) {
  try {
    const { employeeId, year, month } = req.query ?? {};
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    if (!employeeId) return res.status(400).json({ ok: false, message: 'employeeId is required.' });
    if (!Number.isInteger(parsedYear) || !Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ ok: false, message: 'Valid year and month are required.' });
    }

    const employeeUser = await findUserById(employeeId);
    if (!employeeUser || employeeUser.role !== 'employee') {
      return res.status(404).json({ ok: false, message: 'Employee user not found.' });
    }

    const [tasks, users] = await Promise.all([listAllDailyTasks(), listUsers()]);
    const userMap = new Map(users.map((item) => [item.id, item]));
    const rows = tasks
      .filter((task) => task.employeeId === employeeId)
      .filter((task) => {
        const d = task.workDate ? new Date(task.workDate) : null;
        if (!d || Number.isNaN(d.getTime())) return false;
        return d.getFullYear() === parsedYear && d.getMonth() + 1 === parsedMonth;
      })
      .map((task, index) => ({
        No: index + 1,
        Date: task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '',
        JobStartAt: task.jobStartAt ? new Date(task.jobStartAt).toISOString() : '',
        JobEndAt: task.jobEndAt ? new Date(task.jobEndAt).toISOString() : '',
        EmployeeName: userMap.get(task.employeeId)?.name || employeeUser.name || '',
        EmployeeEmail: userMap.get(task.employeeId)?.email || employeeUser.email || '',
        AssignedBy: userMap.get(task.assignedById)?.name || 'Admin',
        Title: task.title || '',
        Status: task.status || '',
        PlannedTask: task.plannedTask || '',
        AdminNote: task.adminNote || '',
        WorkUpdate: task.workUpdate || '',
        ProofLink: task.proofLink || '',
        CompletedAt: task.completedAt ? new Date(task.completedAt).toISOString() : '',
        UpdatedAt: task.updatedAt ? new Date(task.updatedAt).toISOString() : '',
      }));

    const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Info: 'No task data found for this month.' }]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Monthly Data');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const monthLabel = `${parsedYear}-${String(parsedMonth).padStart(2, '0')}`;
    const safeName = String(employeeUser.name || 'employee').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="employee-monthly-report-${safeName || 'employee'}-${monthLabel}.xlsx"`);
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to export employee monthly report.', error: error.message });
  }
}

export async function getAdminUsers(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    const [users, total] = await Promise.all([
      listUsers({ page, limit }),
      countUsers(),
    ]);
    const totalPages = limit ? Math.max(Math.ceil(total / limit), 1) : 1;
    return res.status(200).json({
      ok: true,
      data: users,
      pagination: { page, limit, total, totalPages }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to load users.', error: error.message });
  }
}

export async function patchAdminUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body ?? {};
    if (!role || !['admin', 'user', 'employee', 'creator'].includes(String(role))) {
      return res.status(400).json({ ok: false, message: 'Valid role is required (admin, user, employee, or creator).' });
    }

    const targetUser = await findUserById(userId);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'User not found.' });

    const nextRole = String(role);
    if (targetUser.id === req.auth.userId && nextRole !== 'admin') {
      return res.status(400).json({ ok: false, message: 'You cannot remove your own admin role.' });
    }
    if (targetUser.role === 'admin' && nextRole !== 'admin' && targetUser.isActive !== false) {
      const activeAdminCount = await countActiveUsersByRole('admin');
      if (activeAdminCount <= 1) {
        return res.status(400).json({ ok: false, message: 'Cannot demote the last active admin user.' });
      }
    }

    const updates = { role: nextRole };
    if (nextRole === 'creator') {
      updates.creatorRequestStatus = 'approved';
      updates.creatorReviewedAt = new Date();
      updates.creatorReviewedById = req.auth.userId;
    }
    if (nextRole !== 'creator' && targetUser.creatorRequestStatus === 'pending') {
      updates.creatorRequestStatus = 'rejected';
      updates.creatorReviewedAt = new Date();
      updates.creatorReviewedById = req.auth.userId;
    }
    const updated = await updateUserById(userId, updates);
    if (!updated) return res.status(404).json({ ok: false, message: 'User not found.' });

    if (nextRole === 'employee') {
      const existing = await findEmployeeByEmail(updated.email);
      if (existing) {
        await updateEmployeeById(existing.id, {
          userId: updated.id,
          name: updated.name,
          email: updated.email,
          isActive: updated.isActive !== false,
        });
      } else {
        await createEmployee({
          userId: updated.id,
          name: updated.name,
          email: updated.email,
          role: 'Employee',
          isActive: updated.isActive !== false,
        });
      }
    }
    await deleteCacheByPrefix('overview:');

    return res.status(200).json({
      ok: true,
      message: 'User role updated successfully.',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        creatorRequestStatus: updated.creatorRequestStatus || 'none',
        creatorRequestMessage: updated.creatorRequestMessage || '',
        creatorRequestedAt: updated.creatorRequestedAt || null,
        creatorReviewedAt: updated.creatorReviewedAt || null,
        isActive: updated.isActive !== false,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to update user role.', error: error.message });
  }
}

export async function patchAdminUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const { isActive } = req.body ?? {};
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ ok: false, message: 'isActive boolean is required.' });
    }
    const targetUser = await findUserById(userId);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'User not found.' });
    if (targetUser.id === req.auth.userId && isActive === false) {
      return res.status(400).json({ ok: false, message: 'You cannot disable your own admin account.' });
    }
    if (targetUser.role === 'admin' && isActive === false) {
      const activeAdminCount = await countActiveUsersByRole('admin');
      if (activeAdminCount <= 1) {
        return res.status(400).json({ ok: false, message: 'Cannot disable the last active admin.' });
      }
    }
    const updates = { isActive };
    if (isActive === false) updates.tokenVersion = Number(targetUser.tokenVersion || 0) + 1;
    const updated = await updateUserById(userId, updates);
    if (!updated) return res.status(404).json({ ok: false, message: 'User not found.' });
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, message: `User ${isActive ? 'enabled' : 'disabled'} successfully.`, data: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to update user status.', error: error.message });
  }
}

export async function postAdminUserRevokeSession(req, res) {
  try {
    const { userId } = req.params;
    const targetUser = await findUserById(userId);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'User not found.' });
    const updated = await incrementUserTokenVersionById(userId);
    if (!updated) return res.status(404).json({ ok: false, message: 'User not found.' });
    return res.status(200).json({ ok: true, message: 'User sessions revoked successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to revoke user sessions.', error: error.message });
  }
}

export async function deleteAdminUser(req, res) {
  try {
    const { userId } = req.params;
    const targetUser = await findUserById(userId);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'User not found.' });
    if (targetUser.id === req.auth.userId) {
      return res.status(400).json({ ok: false, message: 'You cannot delete your own admin account.' });
    }
    if (targetUser.role === 'admin') {
      const adminCount = await countUsersByRole('admin');
      if (adminCount <= 1) return res.status(400).json({ ok: false, message: 'Cannot delete the last admin user.' });
    }
    await deleteUserById(userId);
    await deleteCacheByPrefix('overview:');
    return res.status(200).json({ ok: true, message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Unable to delete user.', error: error.message });
  }
}

export async function patchAdminUserCreatorRequest(req, res) {
  try {
    const { userId } = req.params;
    const { action } = req.body ?? {};
    const normalizedAction = String(action || '').toLowerCase();
    if (!['approve', 'reject'].includes(normalizedAction)) {
      return res.status(400).json({ ok: false, message: 'Action must be approve or reject.' });
    }

    const targetUser = await findUserById(userId);
    if (!targetUser) return res.status(404).json({ ok: false, message: 'User not found.' });
    if (targetUser.creatorRequestStatus !== 'pending') {
      return res.status(400).json({ ok: false, message: 'No pending creator request for this user.' });
    }

    const updates =
      normalizedAction === 'approve'
        ? {
            role: 'creator',
            creatorRequestStatus: 'approved',
            creatorReviewedAt: new Date(),
            creatorReviewedById: req.auth.userId,
          }
        : {
            creatorRequestStatus: 'rejected',
            creatorReviewedAt: new Date(),
            creatorReviewedById: req.auth.userId,
          };

    const updated = await updateUserById(userId, updates);
    if (!updated) return res.status(404).json({ ok: false, message: 'User not found.' });
    await deleteCacheByPrefix('overview:');

    return res.status(200).json({
      ok: true,
      message:
        normalizedAction === 'approve'
          ? 'Creator request approved and role granted.'
          : 'Creator request rejected.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to process creator request.',
      error: error.message,
    });
  }
}
