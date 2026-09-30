import { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
      note: String,
    },
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        slug: String,
        sku: String,
        price: Number,
        discount: Number,
        quantity: Number,
        stock: Number,
        image: {
          public_id: String,
          url: String,
        },
        categoryId: String,
        subcategoryId: String,
        color: {
          _id: String,
          name: String,
          value: String,
        },
        size: {
          _id: String,
          name: String,
          value: String,
        },
        // ✅ **FIX: Schema now fully aligned with the cart item structure**
        variant: {
          _id: String,
          name: String,
          price: Number,
          salePrice: Number,
          stock: Number,
          discount: Number, // Added this field
        },
      },
    ],
    totalItems: Number,
    totalAmount: Number,
    subTotal: Number,
    paymentMethod: String,
    deliveryCharge: Number,
    advanceAmount: Number,
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shiped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
