import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Cart from "@/models/Cart";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });
    return NextResponse.json(
      { cart: cart || { userId, products: [] } },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_CART_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
