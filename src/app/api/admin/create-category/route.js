import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";

// GET - Fetch all categories with subcategories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request) {
  try {
    await connectDB();
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name must be less than 50 characters",
        },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 400 }
      );
    }

    const newCategory = new Category({
      name: name.trim(),
      subcategories: [],
    });

    await newCategory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {

    if (error.code === 11000) {
      // Check if it's a subcategory name conflict
      if (error.message.includes("subcategories.name")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Database index conflict. Please click 'Fix Database Index' button and try again.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(request) {
  try {
    await connectDB();
    const { categoryId, name } = await request.json();

    if (!categoryId || !name || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID and name are required",
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name must be less than 50 characters",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    // Check if new name already exists (excluding current category)
    const duplicateCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      _id: { $ne: categoryId },
    });
    if (duplicateCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name already exists",
        },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: name.trim() },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
  
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name already exists",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID is required",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}
