import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";

// POST - Create a new subcategory
export async function POST(request) {
  try {
    await connectDB();
    const { categoryId, name } = await request.json();

    if (!categoryId || !name || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID and subcategory name are required",
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory name must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory name must be less than 50 characters",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    // Check if subcategory already exists in this category
    const existingSubcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existingSubcategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory already exists in this category",
        },
        { status: 400 }
      );
    }

    // Add subcategory to the category
    category.subcategories.push({ name: name.trim() });
    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create subcategory",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a subcategory
export async function PUT(request) {
  try {
    await connectDB();
    const { categoryId, subcategoryId, name } = await request.json();

    if (!categoryId || !subcategoryId || !name || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID, subcategory ID, and name are required",
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory name must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory name must be less than 50 characters",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    // Find and update the subcategory
    const subcategoryIndex = category.subcategories.findIndex(
      (sub) => sub._id.toString() === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory not found",
        },
        { status: 404 }
      );
    }

    // Check if new name already exists (excluding current subcategory)
    const duplicateSubcategory = category.subcategories.find(
      (sub, index) =>
        index !== subcategoryIndex &&
        sub.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicateSubcategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Subcategory name already exists in this category",
        },
        { status: 400 }
      );
    }

    // Update the subcategory
    category.subcategories[subcategoryIndex].name = name.trim();
    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory updated successfully",
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update subcategory",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a subcategory
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");

    if (!categoryId || !subcategoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID and subcategory ID are required",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    // Remove the subcategory
    category.subcategories = category.subcategories.filter(
      (sub) => sub._id.toString() !== subcategoryId
    );
    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory deleted successfully",
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete subcategory",
      },
      { status: 500 }
    );
  }
}
