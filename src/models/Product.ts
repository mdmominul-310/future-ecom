import mongoose, { Schema, Document } from "mongoose";

interface CloudinaryImage {
  public_id: string;
  url: string;
}

export interface IVariant {
  name: string;
  salePrice: number;
  price: number;
  discount?: number;
  sku?: string;
  stock: number;
}

const VariantSchema = new Schema<IVariant>({
  name: { type: String, default: "" },
  salePrice: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  sku: { type: String, default: "" },
  stock: { type: Number, default: 0 },
});

export interface IProduct extends Document {
  name: string;
  description: string;
  shortDescription?: string;
  keyFeatures?: string[];
  price: number;
  salePrice?: number;
  discount?: number;
  buyPrice?: number;
  costPerProduct?: number;
  sku: string;
  stock: number;
  category?: mongoose.Types.ObjectId; // Made optional
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  weight?: string;
  dimensions?: {
    width?: string;
    height?: string;
    depth?: string;
  };
  warranty?: string;
  returnPolicy?: string;
  videoUrl?: string;
  tags: string[];
  images: CloudinaryImage[];
  additionalImages: CloudinaryImage[];
  specifications: {
    name: string;
    value: string;
  }[];
  colors: {
    _id: string;
    name: string;
    value: string;
    description?: string;
  }[];
  sizes: {
    _id: string;
    name: string;
    value: string;
    description?: string;
  }[];
  rating: number;
  reviewsCount: number;
  soldCount: number;
  clickCount: number;
  revenueGenerated: number;
  wishlistCount: number;
  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  currency: string;
  status: "draft" | "published" | "archived";
  variants: IVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema = new Schema<CloudinaryImage>({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, default: "New Product" },
    // --- FIX: Made fields optional and added defaults ---
    description: { type: String, default: "" },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      default: () => `SKU-${Date.now()}`,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
    // --- End of Fix ---
    shortDescription: { type: String, default: "" },
    keyFeatures: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    buyPrice: { type: Number, default: 0 },
    costPerProduct: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: false,
    },
    brand: { type: String, default: "" },
    weight: { type: String, default: "" },
    dimensions: { width: String, height: String, depth: String },
    warranty: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    tags: [String],
    images: [CloudinaryImageSchema],
    additionalImages: [CloudinaryImageSchema],
    specifications: [{ name: String, value: String }],
    colors: [{ _id: String, name: String, value: String, description: String }],
    sizes: [{ _id: String, name: String, value: String, description: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
);

ProductSchema.pre<IProduct>("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    const name = this.name || "product";
    this.slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
