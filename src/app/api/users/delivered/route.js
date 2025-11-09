import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const orders = await Order.find({
      user: userId,
      status: "delivered",
    });

    const allOrders = orders.filter((order) => {
      if (order.paymentMethod === "uddoktapay") {
        return order.uddoktaPay?.status === "success";
      }
      return true;
    });
    return NextResponse.json(allOrders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

