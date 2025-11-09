import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },

  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
},{
    timestamps: true,
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
