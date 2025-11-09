import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Blog from "@/models/Blog";

// GET all blogs
export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { title, description, photo, photoPublicId, subtitles } = body;

    if (!title || !description || !photo) {
      return NextResponse.json(
        { success: false, error: "Title, description, and photo are required" },
        { status: 400 }
      );
    }

    const blog = new Blog({
      title,
      description,
      photo,
      photoPublicId,
      subtitles: subtitles || [],
    });

    await blog.save();
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
