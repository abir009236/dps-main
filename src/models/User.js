import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  refundBalance : {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
