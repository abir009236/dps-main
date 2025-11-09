import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Blog from "@/models/Blog";
import cloudinary from "@/lib/cloudinary";

// GET single blog
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const { title, description, photo, photoPublicId, subtitles } = body;

    if (!title || !description || !photo) {
      return NextResponse.json(
        { success: false, error: "Title, description, and photo are required" },
        { status: 400 }
      );
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        description,
        photo,
        photoPublicId,
        subtitles: subtitles || [],
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (blog?.photoPublicId) {
      try {
        const result = await cloudinary.uploader.destroy(blog.photoPublicId, {
          resource_type: "image",
        });
        
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete the blog from database
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
