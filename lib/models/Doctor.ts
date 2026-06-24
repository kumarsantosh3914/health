import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    date: { type: String, required: true },
  },
  { _id: false }
);

const ClinicSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    neighbourhood: { type: String, default: "" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timings: { type: String, required: true },
  },
  { _id: false }
);

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    photo: { type: String, default: "" },
    qualifications: { type: String, required: true },
    speciality: { type: String, required: true, index: true },
    experience_years: { type: Number, required: true },
    consultation_fee: { type: Number, required: true },
    clinic: { type: ClinicSchema, required: true },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    review_count: { type: Number, default: 0 },
    available_online: { type: Boolean, default: false },
    is_open_now: { type: Boolean, default: true },
    patient_count: { type: Number, default: 0 },
    // Whether a real consultation fee is known. Google Places has no fee data,
    // so imported records set this false → UI shows "Fee on request".
    fee_listed: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    about: { type: String, default: "" },
    reviews: { type: [ReviewSchema], default: [] },
    // Provenance of the record.
    source: {
      type: String,
      enum: ["seed", "google_places", "community"],
      default: "seed",
      index: true,
    },
    // Community moderation
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
      index: true,
    },
    submitted_by: { type: String, default: "" },
    // ABDM Healthcare Professionals Registry verification
    hpr_id: { type: String, default: "" },
    hpr_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Doctor = models.Doctor ?? model("Doctor", DoctorSchema);

export default Doctor;
