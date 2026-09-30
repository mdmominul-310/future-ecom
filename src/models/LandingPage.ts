import mongoose, { Document, Schema, models, Model } from "mongoose";

// Interface for a generic image object stored in DB
export interface IImage {
  url: string;
  public_id: string;
}

// THIS IS THE NEW, CORRECT INTERFACE
export interface IPageContent {
  heroHeadline: string;
  heroImage: IImage;
  heroFeatures: string[];
  ctaSubheadline: string;
  ctaDescription: string;
  offerSectionHeadline: string;
  offerSectionFeatures: string[];
  comparisonHeadline: string;
  comparisonText: string;
  reviewSectionHeadline: string;
  facebookReviewUrl: string;
  youtubeReviewUrl: string;
  customerReviewHeadline: string;
  phoneNumber: string;
  additionalImagesHeadline: string;
  reviewScreenshots: IImage[];
}

export interface ILandingPage extends Document {
  product: mongoose.Schema.Types.ObjectId;
  content: IPageContent;
  urlSlug: string;
}

const ImageSchema: Schema<IImage> = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

// THIS IS THE NEW, CORRECT SCHEMA DEFINITION
const LandingPageSchema: Schema<ILandingPage> = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    content: {
      heroHeadline: String,
      heroImage: ImageSchema,
      heroFeatures: [String],
      ctaSubheadline: String,
      ctaDescription: String,
      offerSectionHeadline: String,
      offerSectionFeatures: [String],
      comparisonHeadline: String,
      comparisonText: String,
      reviewSectionHeadline: String,
      facebookReviewUrl: String,
      youtubeReviewUrl: String,
      customerReviewHeadline: String,
      phoneNumber: String,
      additionalImagesHeadline: String,
      reviewScreenshots: [ImageSchema],
    },
    urlSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const LandingPage: Model<ILandingPage> =
  models.LandingPage || mongoose.model("LandingPage", LandingPageSchema);

export default LandingPage;
