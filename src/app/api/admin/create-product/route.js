import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

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

export async function POST(req) {
  try {
    await connectDB();
    const {
      title,
      category,
      subcategory,
      image,
      imagePublicId,
      details,
      customerInputRequirements,
      pricingType,
      fixedPrice,
      durationBasedPricing,
      availability,
    } = await req.json();

    const product = await Product.create({
      title,
      category,
      subcategory,
      image,
      imagePublicId,
      details,
      customerInputRequirements,
      pricingType,
      fixedPrice,
      durationBasedPricing,
      availability,
      status: "active",
    });
    return NextResponse.json(
      { message: "Product created successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const {
      title,
      category,
      subcategory,
      image,
      imagePublicId,
      details,
      customerInputRequirements,
      pricingType,
      fixedPrice,
      durationBasedPricing,
      availability,
      status,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      );
    }

    const updateDoc = {
      ...(title !== undefined ? { title } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(subcategory !== undefined ? { subcategory } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(imagePublicId !== undefined ? { imagePublicId } : {}),
      ...(details !== undefined ? { details } : {}),
      ...(customerInputRequirements !== undefined
        ? { customerInputRequirements }
        : {}),
      ...(pricingType !== undefined ? { pricingType } : {}),
      ...(fixedPrice !== undefined ? { fixedPrice } : {}),
      ...(durationBasedPricing !== undefined ? { durationBasedPricing } : {}),
      ...(availability !== undefined ? { availability } : {}),
      ...(status !== undefined ? { status } : {}),
    };

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { imagePublicId } = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product?.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId, {
          resource_type: "image",
        });
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
    await Product.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
