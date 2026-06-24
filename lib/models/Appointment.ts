import { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    doctorSlug: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    consultationType: {
      type: String,
      enum: ["in-person", "online"],
      default: "in-person",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Appointment = models.Appointment ?? model("Appointment", AppointmentSchema);

export default Appointment;
