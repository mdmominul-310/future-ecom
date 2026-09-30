import { Schema, model, models, Document, Types } from "mongoose";

export interface IReview extends Document {
  name: string;
  comment: string;
  rating: number;
  createdAt: Date;
  product?: Types.ObjectId; // Product reference is optional
}

const ReviewSchema = new Schema<IReview>({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  comment: {
    type: String,
    required: [true, "Comment is required."],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required."],
    min: 1,
    max: 5,
  },
  // This is the key to fixing the error.
  // By setting `required` to `false`, we allow general site reviews
  // that are not associated with a specific product.
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
