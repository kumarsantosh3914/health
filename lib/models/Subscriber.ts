import { Schema, model, models } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

const Subscriber = models.Subscriber ?? model("Subscriber", SubscriberSchema);

export default Subscriber;
