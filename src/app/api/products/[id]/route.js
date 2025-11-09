import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Cart from "@/models/Cart";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { id } = await params;
    const cartId = searchParams.get("cartId");

    if (!id || !cartId) {
      return NextResponse.json(
        { error: "UserId and cartId are required" },
        { status: 400 }
      );
    }
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: id },
      { $pull: { products: { _id: cartId } } },
      { new: true }
    );
    if (!updatedCart) {
      return NextResponse.json(
        { error: "Cart or product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Product removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // userId
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");
    const body = await req.json();
    const { quantity } = body || {};

    if (!id || !cartId) {
      return NextResponse.json(
        { error: "UserId and cartId are required" },
        { status: 400 }
      );
    }

    if (typeof quantity !== "number") {
      return NextResponse.json(
        { error: "quantity (number) is required" },
        { status: 400 }
      );
    }

    // If quantity <= 0, remove the item
    if (quantity <= 0) {
      await Cart.findOneAndUpdate(
        { userId: id },
        { $pull: { products: { _id: cartId } } },
        { new: true }
      );
      return NextResponse.json(
        { message: "Product removed successfully" },
        { status: 200 }
      );
    }

    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const product = cart.products.id(cartId);
    if (!product) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    product.quantity = quantity;
    await cart.save();

    return NextResponse.json({ message: "Quantity updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}
