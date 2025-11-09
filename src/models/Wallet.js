import mongoose, { Schema } from "mongoose";

const walletMethodSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    number: { type: String }, // For Bkash, Rocket, Nagad
    apiKey: { type: String }, // For Uddoktapay
  },
  { _id: false }
);

const walletSchema = new Schema(
  {
    // Singleton key to ensure only one document exists
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "GLOBAL_WALLET_CONFIG",
      immutable: true,
    },
    bkash: { type: walletMethodSchema, default: () => ({}) },
    rocket: { type: walletMethodSchema, default: () => ({}) },
    nagad: { type: walletMethodSchema, default: () => ({}) },
    uddoktapay: { type: walletMethodSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.Wallets ||
  mongoose.model("Wallets", walletSchema);
