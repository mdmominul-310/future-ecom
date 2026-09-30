import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the document
export interface ICampaignBanner extends Document {
  title: string;
  description: string;
  image: {
    public_id: string;
    url: string;
  };
  targetDate: Date;
  linkedProductId: string;
  isActive: boolean;
}

// Use a type alias instead of an empty interface
type ICampaignBannerModel = Model<ICampaignBanner>;

const CampaignBannerSchema: Schema<ICampaignBanner> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    targetDate: { type: Date, required: true },
    linkedProductId: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// When a banner is saved, if it's set to active, ensure all others are inactive.
CampaignBannerSchema.pre("save", async function (next) {
  // Check if 'isActive' was modified to true
  if (this.isModified("isActive") && this.isActive) {
    // 'this.constructor' refers to the model. We cast it to the correct type.
    const Model = this.constructor as ICampaignBannerModel;

    // Set all other documents' isActive to false
    await Model.updateMany({ _id: { $ne: this._id } }, { isActive: false });
  }
  next();
});

export default (mongoose.models.CampaignBanner as ICampaignBannerModel) ||
  mongoose.model<ICampaignBanner, ICampaignBannerModel>(
    "CampaignBanner",
    CampaignBannerSchema
  );
