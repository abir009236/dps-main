import connectDB from "@/lib/mongoose";
import Faq from "@/models/Faq";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { question, answer } = await req.json();
    const faq = await Faq.create({ question, answer });
    return NextResponse.json({
      message: "FAQ added successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add FAQ", status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const faqs = await Faq.find().sort({ createdAt: -1 });
    return NextResponse.json({ faqs, status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to get FAQs", status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "FAQ not found", status: 404 });
    }
    const { question, answer } = await req.json();
    const faq = await Faq.findByIdAndUpdate({ _id: id }, { question, answer });
    return NextResponse.json({
      message: "FAQ updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to update FAQ",
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "FAQ not found", status: 404 });
    }
    const result = await Faq.findByIdAndDelete({ _id: id });
    if (!result) {
      return NextResponse.json({ message: "FAQ not found", status: 404 });
    }
    return NextResponse.json({
      message: "FAQ deleted successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete FAQ", status: 500 });
  }
}