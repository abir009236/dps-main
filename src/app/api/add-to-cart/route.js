import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Cart from "@/models/Cart";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, product } = body;

    if (!userId || !product) {
      return NextResponse.json(
        { message: "userId and product are required" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, products: [] });
    }

    const { productId, productName, quantity, price, extraFields, productImage } = product;

    const existingIndex = cart.products.findIndex((p) => {
      if (String(p.productId) !== String(productId)) return false;
      // Compare extraFields map content if present
      const pFields = p.extraFields ? Object.fromEntries(p.extraFields) : {};
      const newFields = extraFields || {};
      const pKeys = Object.keys(pFields);
      const nKeys = Object.keys(newFields);
      if (pKeys.length !== nKeys.length) return false;
      return pKeys.every((k) => String(pFields[k]) === String(newFields[k]));
    });

    if (existingIndex !== -1) {
      cart.products[existingIndex].quantity += quantity;
      cart.products[existingIndex].price = price; 
    } else {
      cart.products.push({
        productId,
        productName,
        quantity,
        price,
        extraFields,
        productImage,
      });
    }

    await cart.save();
    return NextResponse.json(
      { message: "Added to cart", cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
