import { NextResponse } from "next/server";
import Setting from "@/models/Setting";
import connectDB from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.findOne();

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read website settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();

    const result = await Setting.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({
      message: "Website settings updated successfully",
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save website settings" },
      { status: 500 }
    );
  }
}
