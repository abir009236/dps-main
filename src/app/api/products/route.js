import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get products" },
      { status: 500 }
    );
  }
}