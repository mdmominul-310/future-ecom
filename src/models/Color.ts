// models/Color.ts
import mongoose from "mongoose";

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    value: { type: String, required: true }, // e.g., #FF5733,

  },
  { timestamps: true }
);

export const Color = mongoose.models.Color || mongoose.model("Color", ColorSchema);
