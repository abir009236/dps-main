import mongoose, { Schema } from "mongoose";

const subtitleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  photoPublicId: {
    type: String,
    required: true,
  },
  subtitles: [subtitleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
