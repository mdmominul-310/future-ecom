import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image: {
    public_id: string;
    url: string;
  };
  subcategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    subcategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory'
    }],
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
