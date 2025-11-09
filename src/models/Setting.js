import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    websiteName: { type: String, required: true },
    websiteLogoLink: { type: String, required: true },
    workingHours: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    instagramLink: { type: String, required: true },
    linkedinLink: { type: String, required: true },
    facebookLink: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    telegramNumber: { type: String, required: true },
    emailUser: { type: String, required: true },
    emailPassword: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", settingSchema);
