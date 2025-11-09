import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
// POST - Submit a review
export async function POST(request) {
  try {
    await connectDB();

    const { orderId, rating, review, userName, userEmail } =
      await request.json();

    // Validate required fields
    if (!orderId || !rating || !review || !userName || !userEmail) {
      return NextResponse.json(
        { message: "Order ID, rating, and review are required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById({ _id: orderId });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Create the review
    const newReview = new Review({
      userName: userName,
      userEmail: userEmail,
      orderId: orderId,
      rating: rating,
      review: review.trim(),
    });

    await newReview.save();

    // Update the order to mark as reviewed
    await Order.findByIdAndUpdate(orderId, { reviews: true });

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get reviews for a specific order
export async function GET(request) {
  try {
    await connectDB();

    // Find the review
    const review = await Review.find({ status: "approved" });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
