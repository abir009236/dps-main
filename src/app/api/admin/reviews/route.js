import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Review from "@/models/Review";


// GET - Fetch all reviews with optional status filter
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build query object
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Fetch reviews with sorting by newest first
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update review status (approve/reject)
export async function PUT(request) {
  try {
    await connectDB();

    const { reviewId, status } = await request.json();

    if (!reviewId || !status) {
      return NextResponse.json(
        { message: "Review ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be pending, approved, or rejected" },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Review ${status} successfully`,
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(request) {
  try {
    await connectDB();


    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { message: "Review ID is required" },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
