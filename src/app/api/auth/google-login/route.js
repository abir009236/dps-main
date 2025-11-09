import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";

export async function POST(req) {
  const { email, name, profile_picture } = await req.json();
  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }
    const newUser = await User.create({
      email,
      name,
      profilePicture: profile_picture,
      status: "Active",
      role: "User",
    });
    return NextResponse.json({ user: newUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
