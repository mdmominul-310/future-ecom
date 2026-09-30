// models/Size.ts
import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Size || mongoose.model("Size", sizeSchema);
