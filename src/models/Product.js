import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    details: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    customerInputRequirements: [
      {
        label: {
          type: String,
          required: true,
          default: null,
        },
        type: {
          type: String,
          enum: ["text", "email", "password", "number", "textarea", "select"],
          required: true,
          default: null,
        },
      },
    ],
    pricingType: {
      type: String,
      enum: ["fixed", "duration"],
      required: true,
    },
    fixedPrice: {
      type: Number,
      default: null,
    },
    durationBasedPricing: [
      {
        months: {
          type: Number,
          enum: [1, 2, 3, 6, 9, 12],
          required: true,
          default: null,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
          default: null,
        },
      },
    ],
    availability: {
      type: String,
      enum: ["in_stock", "out_of_stock"],
      default: "in_stock",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
