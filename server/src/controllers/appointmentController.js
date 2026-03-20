import {
  createServiceAppointment,
  listServiceAppointments,
  listServiceAppointmentsPaginated,
} from '../services/appointmentService.js';
import { getSiteContent } from '../services/siteContentService.js';
import { countServiceAppointments } from '../models/serviceAppointmentModel.js';
import { deleteCacheByPrefix } from '../services/cacheService.js';
import { parsePagination } from '../utils/pagination.js';

function validateAppointmentPayload(payload) {
  const { serviceTitle, name, email, phone, preferredDate } = payload ?? {};
  if (!serviceTitle || !name || !email || !phone || !preferredDate) {
    return 'Service, name, email, phone and preferred date are required.';
  }
  return '';
}

export async function postServiceAppointment(req, res) {
  try {
    const content = await getSiteContent();
    const maintenanceMode = content?.systemSettings?.maintenanceMode ?? false;
    if (maintenanceMode) {
      return res.status(503).json({
        ok: false,
        message:
          content?.systemSettings?.maintenanceMessage ||
          'Service is temporarily unavailable due to maintenance.',
      });
    }
    const allowServiceAppointments = content?.systemSettings?.allowServiceAppointments ?? true;
    if (!allowServiceAppointments) {
      return res.status(403).json({
        ok: false,
        message: 'Service appointment booking is currently disabled by admin.',
      });
    }

    const validationMessage = validateAppointmentPayload(req.body);
    if (validationMessage) {
      return res.status(400).json({
        ok: false,
        message: validationMessage,
      });
    }

    await createServiceAppointment(req.body);
    await deleteCacheByPrefix('overview:');
    return res.status(201).json({
      ok: true,
      message: 'Appointment request submitted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to create appointment.',
      error: error.message,
    });
  }
}

export async function getServiceAppointments(req, res) {
  try {
    const { page, limit } = parsePagination(req.query);
    if (limit) {
      const [appointments, total] = await Promise.all([
        listServiceAppointmentsPaginated({ page, limit }),
        countServiceAppointments()
      ]);
      return res.status(200).json({
        ok: true,
        data: appointments,
        pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) }
      });
    }
    const appointments = await listServiceAppointments();
    return res.status(200).json({
      ok: true,
      data: appointments,
      pagination: null
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to fetch appointments.',
      error: error.message,
    });
  }
}

