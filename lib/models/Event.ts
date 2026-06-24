import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    city: { type: String, required: true, index: true },
    neighbourhood: { type: String, default: "" },
    date: { type: String, required: true },
    type: {
      type: String,
      enum: ["camp", "donation", "free-opd", "vaccination", "awareness"],
      required: true,
    },
    isFree: { type: Boolean, default: true },
    registrationLink: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Event = models.Event ?? model("Event", EventSchema);

export default Event;
