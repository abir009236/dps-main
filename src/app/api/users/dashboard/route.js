import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const orders = await Order.find({ user: userId });
    const deliverdOrders = orders.filter(
      (order) => order.status === "delivered"
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const processingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled"
    ).length;
    const refundedOrders = orders.filter(
      (order) => order.status === "refunded"
    ).length;
    const totalOrders = orders.length;
    return NextResponse.json(
      {
        totalOrders,
        deliverdOrders,
        pendingOrders,
        processingOrders,
        cancelledOrders,
        refundedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
