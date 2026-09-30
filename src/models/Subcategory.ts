import mongoose, { Schema, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: {
    public_id: string;
    url: string;
  };
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema<ISubcategory>(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      public_id: String,
      url: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Subcategory must belong to a category'],
    },
  },
  { timestamps: true }
);

// Prevent duplicate models in development with hot reloading
const Subcategory = mongoose.models.Subcategory as mongoose.Model<ISubcategory> || mongoose.model<ISubcategory>('Subcategory', subcategorySchema);

export default Subcategory; 