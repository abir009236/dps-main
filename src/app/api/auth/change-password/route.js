import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
  const { oldPassword, newPassword, email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.password = passwordHash;
  await user.save();
  return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
