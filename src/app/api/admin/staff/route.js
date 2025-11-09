import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const GET = async () => {
  await connectDB();
  const staff = await User.find({
    role: "Admin",
  });
  return NextResponse.json(staff);
};

export const POST = async (request) => {
  try {
    await connectDB();
    const { name, email, phone, password, status, role } = await request.json();

    // check if staff already exists
    const staffExists = await User.findOne({ email });

    if (staffExists) {
      return NextResponse.json({ error: "Staff already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      phone,
      password: passwordHash,
      status,
      role,
    });

    if (staff) {
      return NextResponse.json({ message: "Staff created successfully" });
    } else {
      return NextResponse.json({ error: "Staff creation failed" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" });
  }
};

export const DELETE = async (request) => {
  try {
    await connectDB();
    const { id } = await request.json();
    const user = await User.findByIdAndDelete({ _id: id });
    if (user) {
      return NextResponse.json({ message: "Staff deleted successfully" });
    } else {
      return NextResponse.json({ error: "Staff deletion failed" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" });
  }
};

export const PUT = async (request) => {
  try {
    await connectDB();
    const { name, email, phone, status, role, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const updateDoc = { name, email, phone, status, role };

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
      return NextResponse.json({ message: "Staff updated successfully" });
    }
    return NextResponse.json({ error: "Staff update failed" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
