"use client";

import { useState } from "react";
import type { Doctor } from "@/lib/types";
import BookingModal from "./BookingModal";

export default function DoctorBooking({ doctor }: { doctor: Doctor }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white transition hover:bg-primary-600"
      >
        Book Appointment · ₹{doctor.consultation_fee}
      </button>
      <BookingModal doctor={doctor} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
