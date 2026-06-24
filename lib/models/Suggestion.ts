import { Schema, model, models } from "mongoose";

const SuggestionSchema = new Schema(
  {
    doctorId: { type: String, required: true, index: true },
    doctorSlug: { type: String, default: "" },
    field: { type: String, default: "" },
    changes: { type: Schema.Types.Mixed, default: {} },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "reviewed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Suggestion = models.Suggestion ?? model("Suggestion", SuggestionSchema);

export default Suggestion;
