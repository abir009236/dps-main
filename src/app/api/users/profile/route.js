import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

// GET user profile
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { name, phone } = await request.json();

    // Validate input
    if (!name || name.trim().length === 0 || !userId) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (phone && phone.trim().length > 0) {
      // Basic phone validation (you can enhance this)
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        phone: phone ? phone.trim() : "",
      },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
