import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: {
          type: String,
          required: true,
        },
        extraFields: {
          type: Map,
          of: String,
          default: {},
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["bkash", "rocket", "nagad", "uddoktapay", "refund-balance"],
      required: true,
    },
    orderNumber: { type: String, required: true },
    manualPaymentMethod: {
      senderNumber: { type: String },
      senderTransactionId: { type: String },
    },
    uddoktaPay: {
      invoiceId: { type: String },
      paymentUrl: { type: String },
      status: {
        type: String,
        enum: ["pending", "success", "failed", "initiated"],
      },
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "refunded", "cancelled"],
      default: "pending",
    },
    cancelReason: { type: String, default: null },
    deliverdDetails: { type: String, default: null },
    reviews: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
