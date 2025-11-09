import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();
    await connectDB();
    const passwordHash = await bcrypt.hash(password, 10);
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const newUser = await User.create({
      email,
      name,
      password: passwordHash,
      phone,
      status: "Active",
      role: "User",
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "User creation failed", error });
  }
}
