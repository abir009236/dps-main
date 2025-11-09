import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "blog-images",
      resource_type: "auto",
      transformation: [
        { width: 800, height: 600, crop: "fill" },
        { quality: "auto" },
      ],
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
