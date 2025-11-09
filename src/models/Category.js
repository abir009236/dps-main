import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subcategories: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Only create index on category name, not on subcategories
categorySchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
