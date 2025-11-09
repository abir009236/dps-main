import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Wallet from "@/models/Wallet";

// GET: Fetch the singleton wallet config
export async function GET() {
  try {
    await connectDB();
    const config = await Wallet.findOne({
      singletonKey: "GLOBAL_WALLET_CONFIG",
    });
    if (!config) {
      const created = await Wallet.create({});
      return NextResponse.json(
        { success: true, wallet: created },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: true, wallet: config },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Upsert specific wallet method configuration
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { method, enabled, number, apiKey } = body;

    const allowed = ["bkash", "rocket", "nagad", "uddoktapay"];
    if (!allowed.includes(method)) {
      return NextResponse.json(
        { success: false, error: "Invalid method" },
        { status: 400 }
      );
    }

    // Server-side validation
    if (["bkash", "rocket", "nagad"].includes(method)) {
      if (!number || !/^\d{11}$/.test(String(number))) {
        return NextResponse.json(
          { success: false, error: "Number must be exactly 11 digits" },
          { status: 400 }
        );
      }
    }
    if (method === "uddoktapay") {
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: "API key is required" },
          { status: 400 }
        );
      }
    }

    const update = {};
    update[method] = {
      enabled: Boolean(enabled),
      number: number || undefined,
      apiKey: apiKey || undefined,
    };

    const updated = await Wallet.findOneAndUpdate(
      { singletonKey: "GLOBAL_WALLET_CONFIG" },
      { $set: update, $setOnInsert: { singletonKey: "GLOBAL_WALLET_CONFIG" } },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { success: true, wallet: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Clear a specific method or entire config
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const method = searchParams.get("method");

    const allowed = ["bkash", "rocket", "nagad", "uddoktapay"];
    if (method && !allowed.includes(method)) {
      return NextResponse.json(
        { success: false, error: "Invalid method" },
        { status: 400 }
      );
    }

    let wallet = await Wallet.findOne({ singletonKey: "GLOBAL_WALLET_CONFIG" });
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet config not found" },
        { status: 404 }
      );
    }

    if (method) {
      wallet[method] = { enabled: false };
      await wallet.save();
      return NextResponse.json({ success: true, wallet }, { status: 200 });
    }

    await Wallet.deleteOne({ _id: wallet._id });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
