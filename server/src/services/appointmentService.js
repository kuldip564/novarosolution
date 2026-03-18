import {
  createServiceAppointmentRow,
  listServiceAppointmentsRows,
} from '../models/serviceAppointmentModel.js';

export async function createServiceAppointment(payload) {
  return createServiceAppointmentRow({
    serviceTitle: payload.serviceTitle.trim(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    preferredDate: payload.preferredDate.trim(),
    notes: payload.notes?.trim() || '',
  });
}

export async function listServiceAppointments() {
  return listServiceAppointmentsRows();
}

