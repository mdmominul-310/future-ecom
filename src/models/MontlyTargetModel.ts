import { Schema, model, models } from "mongoose";

const MonthlyTargetSchema = new Schema(
  {
    target: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const MonthlyTarget =
  models.MonthlyTarget || model("MonthlyTarget", MonthlyTargetSchema);

export default MonthlyTarget;
