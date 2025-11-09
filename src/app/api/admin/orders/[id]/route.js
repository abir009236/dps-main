import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status, cancelReason, deliveryDetails } = body;

    // Validate status
    const validStatuses = ["pending", "delivered", "refunded", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update the order
    if (status === "delivered") {
      const order = await Order.findByIdAndUpdate(id, {
        status,
        deliverdDetails: deliveryDetails,
      });
      return NextResponse.json(
        {
          success: true,
          message: "Order delivered successfully",
        },
        { status: 200 }
      );
    } else if (status === "cancelled") {
      const order = await Order.findByIdAndUpdate(id, { status, cancelReason });
      return NextResponse.json(
        {
          success: true,
          message: "Order cancelled successfully",
        },
        { status: 200 }
      );
    } else if (status === "refunded") {
      const order = await Order.findByIdAndUpdate(id, { status });
      const user = await User.findOne({ _id: order.user });
      if (user) {
        user.refundBalance += order.totalPrice;
        await user.save();
      }
      return NextResponse.json(
        {
          message: "Order refunded successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
