import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await connectDB();
    const admin = await User.findOne({ email, role: "Admin" });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    const { password, ...adminData } = admin.toObject();

    return NextResponse.json(adminData, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { name, phone, email } = await request.json();
    await connectDB();
    const admin = await User.findOneAndUpdate(
      { email, role: "Admin" },
      { name, phone },
      { new: true }
    );
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Admin profile updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
