import mongoose from 'mongoose';

const serviceAppointmentSchema = new mongoose.Schema(
  {
    serviceTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    preferredDate: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

const ServiceAppointment =
  mongoose.models.ServiceAppointment ||
  mongoose.model('ServiceAppointment', serviceAppointmentSchema);

export async function createServiceAppointmentRow(payload) {
  const appointment = await ServiceAppointment.create(payload);
  return {
    id: String(appointment._id),
    serviceTitle: appointment.serviceTitle,
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone,
    preferredDate: appointment.preferredDate,
    notes: appointment.notes,
    status: appointment.status,
    createdAt: appointment.createdAt,
  };
}

export async function listServiceAppointmentsRows() {
  const rows = await ServiceAppointment.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => ({
    id: String(row._id),
    serviceTitle: row.serviceTitle,
    name: row.name,
    email: row.email,
    phone: row.phone,
    preferredDate: row.preferredDate,
    notes: row.notes,
    status: row.status,
    createdAt: row.createdAt,
  }));
}

export async function countServiceAppointments() {
  return ServiceAppointment.countDocuments();
}

