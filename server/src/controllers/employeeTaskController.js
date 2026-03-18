import XLSX from 'xlsx';
import {
  createDailyTask,
  deleteDailyTaskByIdForEmployee,
  listDailyTasksByEmployee,
  updateDailyTaskByIdForEmployee,
} from '../models/dailyTaskModel.js';

function parseDateValue(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function taskToXlsxRows(tasks) {
  return tasks.map((task, index) => ({
    No: index + 1,
    Date: task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '',
    JobStartAt: task.jobStartAt ? new Date(task.jobStartAt).toISOString() : '',
    JobEndAt: task.jobEndAt ? new Date(task.jobEndAt).toISOString() : '',
    Title: task.title || '',
    PlannedTask: task.plannedTask || '',
    Status: task.status || '',
    AdminNote: task.adminNote || '',
    WorkUpdate: task.workUpdate || '',
    ProofLink: task.proofLink || '',
    CompletedAt: task.completedAt ? new Date(task.completedAt).toISOString() : '',
    UpdatedAt: task.updatedAt ? new Date(task.updatedAt).toISOString() : '',
  }));
}

export async function getMyDailyTasks(req, res) {
  try {
    const tasks = await listDailyTasksByEmployee(req.auth.userId);
    return res.status(200).json({ ok: true, data: tasks });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to load tasks.',
      error: error.message,
    });
  }
}

export async function postMyDailyTask(req, res) {
  try {
    const { title, plannedTask, workDate } = req.body ?? {};
    const trimmedTitle = String(title || '').trim();
    if (!trimmedTitle) {
      return res.status(400).json({ ok: false, message: 'Task title is required.' });
    }

    const parsedWorkDate = parseDateValue(workDate);
    if (!parsedWorkDate) {
      return res.status(400).json({
        ok: false,
        message: 'workDate is required.',
      });
    }

    const created = await createDailyTask({
      employeeId: req.auth.userId,
      assignedById: req.auth.userId,
      title: trimmedTitle,
      plannedTask: String(plannedTask || '').trim(),
      workDate: parsedWorkDate,
      jobStartAt: new Date(),
      jobEndAt: null,
      status: 'pending',
      approvalRequested: false,
      approvalRejected: false,
    });

    return res.status(201).json({
      ok: true,
      message: 'Task created successfully.',
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to create task.',
      error: error.message,
    });
  }
}

export async function patchMyDailyTask(req, res) {
  try {
    const { taskId } = req.params;
    const updates = {};
    const {
      title,
      plannedTask,
      workUpdate,
      proofLink,
      status,
      workDate,
    } = req.body ?? {};

    if (typeof title === 'string') updates.title = title.trim();
    if (typeof plannedTask === 'string') updates.plannedTask = plannedTask.trim();
    if (typeof workUpdate === 'string') updates.workUpdate = workUpdate.trim();
    if (typeof proofLink === 'string') updates.proofLink = proofLink.trim();
    if (typeof status === 'string' && ['pending', 'in_progress', 'completed'].includes(status)) {
      if (status === 'completed') {
        // Employee marks completion as approval request; admin must approve to finalize.
        updates.status = 'in_progress';
        updates.completedAt = null;
        updates.jobEndAt = null;
        updates.approvalRequested = true;
        updates.approvalRejected = false;
      } else {
        updates.status = status;
        updates.completedAt = null;
        updates.jobEndAt = null;
        updates.approvalRequested = false;
        updates.approvalRejected = false;
      }
    }

    const parsedWorkDate = parseDateValue(workDate);
    if (parsedWorkDate) updates.workDate = parsedWorkDate;

    const updated = await updateDailyTaskByIdForEmployee(taskId, req.auth.userId, updates);
    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Task not found.' });
    }

    return res.status(200).json({
      ok: true,
      message: 'Task updated successfully.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to update task.',
      error: error.message,
    });
  }
}

export async function deleteMyDailyTask(req, res) {
  try {
    const { taskId } = req.params;
    const deleted = await deleteDailyTaskByIdForEmployee(taskId, req.auth.userId);
    if (!deleted) {
      return res.status(404).json({ ok: false, message: 'Task not found.' });
    }
    return res.status(200).json({ ok: true, message: 'Task deleted successfully.' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to delete task.',
      error: error.message,
    });
  }
}

export async function downloadMyMonthlyTaskReport(req, res) {
  try {
    const year = Number(req.query?.year);
    const month = Number(req.query?.month);
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ ok: false, message: 'Valid year and month are required.' });
    }

    const tasks = await listDailyTasksByEmployee(req.auth.userId);
    const rows = taskToXlsxRows(
      tasks.filter((task) => {
        const date = task.workDate ? new Date(task.workDate) : null;
        if (!date || Number.isNaN(date.getTime())) return false;
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      }),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Info: 'No data found for this month.' }]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'My Daily Tasks');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const monthLabel = `${year}-${String(month).padStart(2, '0')}`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="employee-daily-report-${monthLabel}.xlsx"`);
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to export monthly report.',
      error: error.message,
    });
  }
}
