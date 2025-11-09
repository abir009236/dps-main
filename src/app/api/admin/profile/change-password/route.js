import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  try {
    const { currentPassword, newPassword, email } = await request.json();
    if (!currentPassword || !newPassword || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    await connectDB();
    const admin = await User.findOne({ email, role: "Admin" });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    const isPasswordCorrect = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 401 });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    admin.password = passwordHash;
    await admin.save();
    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}