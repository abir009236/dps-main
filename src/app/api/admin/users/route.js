import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export const GET = async () => {
  await connectDB();
  const users = await User.find({ role: "User" });
  return NextResponse.json(users);
};

export const DELETE = async (request) => {
  await connectDB();
  const { id } = await request.json();
  const user = await User.findOneAndDelete({ _id: id });
  return NextResponse.json({ message: "User deleted successfully" });
};

export const PUT = async (request) => {
  try {
    await connectDB();
    const { name, email, phone, status, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const updateDoc = { name, email, phone, status };

    if (password && String(password).trim().length > 0) {
      const hashed = await bcrypt.hash(String(password), 10);
      updateDoc.password = hashed;
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateDoc },
      { new: true }
    );

    if (user) {
      return NextResponse.json({ message: "User updated successfully" });
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
