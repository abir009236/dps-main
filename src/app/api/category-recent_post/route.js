import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();

    // Fetch all categories
    const categories = await Category.find()
      .select("name subcategories")
      .sort({ name: 1 });

    // Fetch recent 3 blogs
    const recentBlogs = await Blog.find()
      .select("title description photo createdAt")
      .sort({ createdAt: -1 })
      .limit(3);

    return NextResponse.json({
      success: true,
      categories,
      recentBlogs,
    });
  } catch (error) {
    console.error("Error fetching categories and recent blogs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories and recent blogs",
      },
      { status: 500 }
    );
  }
}
