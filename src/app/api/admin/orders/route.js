import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();
    // Get orders with populated user data
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
