import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();
    const admin = await User.findOne({ email, role: "Admin", status: "Active" });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
