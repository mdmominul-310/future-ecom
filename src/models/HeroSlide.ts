import mongoose, { Document, Schema } from "mongoose";

// Interface for the document
export interface IHeroSlide extends Document {
  title: string;
  subtitle: string;
  description: string;
  image: {
    public_id: string;
    url: string;
  };
  url: string;
  linkType: "category" | "product";
  linkedId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const HeroSlideSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    url: { type: String, required: true },
    linkType: { type: String, enum: ["category", "product"], required: true },
    linkedId: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Export the model, creating it if it doesn't already exist
export default mongoose.models.HeroSlide ||
  mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
