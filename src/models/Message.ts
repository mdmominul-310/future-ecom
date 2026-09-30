// models/Message.ts
import { Schema, models, model } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = models.Message || model("Message", messageSchema);
