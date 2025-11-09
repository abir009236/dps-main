import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const orders = await Order.find({
      user: userId,
    });

    const allOrders = orders.filter((order) => {
      if (order.paymentMethod === "uddoktapay") {
        return order.uddoktaPay?.status === "success";
      }
      return true;
    });
    return NextResponse.json(allOrders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      user,
      products,
      totalPrice,
      paymentMethod,
      manualPaymentMethod,
      items,
      uddoktapayApiKey,
      name,
      email,
    } = body;

    if (
      paymentMethod === "bkash" ||
      paymentMethod === "rocket" ||
      paymentMethod === "nagad"
    ) {
      // First check the order is already exist
      const order = await Order.findOne({
        user,
        paymentMethod,
        manualPaymentMethod,
      });
      if (order) {
        return NextResponse.json(
          { error: "Order already exists" },
          { status: 400 }
        );
      }
      if (items.length > 0) {
        const productIds = items.map(
          (item) => new mongoose.Types.ObjectId(item._id)
        );

        // Delete the cart products for this user
        const deleted = await Cart.updateMany(
          { userId: new mongoose.Types.ObjectId(user) },
          { $pull: { products: { _id: { $in: productIds } } } }
        );
      }
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const result = await Order.create({
        user,
        products,
        totalPrice,
        paymentMethod,
        orderNumber,
        manualPaymentMethod,
      });
      if (result) {
        return NextResponse.json(
          { message: "Order placed successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 }
        );
      }
    } else if (paymentMethod === "uddoktapay") {
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const fields = {
        full_name: name,
        email: email,
        amount: totalPrice,
        return_type: "GET",
        metadata: {
          user_id: user,
          order_id: orderNumber,
        },
        redirect_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/users/payment/cancel`,
      };
      const response = await fetch(
        `${process.env.UDDOKTAPAY_API_URL}/api/checkout-v2`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "RT-UDDOKTAPAY-API-KEY": `${uddoktapayApiKey}`,
          },
          body: JSON.stringify(fields),
        }
      );
      const data = await response.json();
      if (data?.status) {
        if (items.length > 0) {
          const productIds = items.map(
            (item) => new mongoose.Types.ObjectId(item._id)
          );

          // Delete the cart products for this user
          const deleted = await Cart.updateMany(
            { userId: new mongoose.Types.ObjectId(user) },
            { $pull: { products: { _id: { $in: productIds } } } }
          );
        }
        const uddoktaPay = {
          paymentUrl: data?.payment_url,
          status: "initiated",
        };
        const result = await Order.create({
          user,
          products,
          totalPrice,
          paymentMethod,
          orderNumber,
          uddoktaPay,
        });

        if (result) {
          return NextResponse.json(data, { status: 200 });
        } else {
          return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      }
    } else if (paymentMethod === "refund-balance") {
      const userInfo = await User.findOne({ _id: user });
      if (userInfo.refundBalance >= totalPrice) {
        userInfo.refundBalance -= totalPrice;
        await userInfo.save();
      } else {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const result = await Order.create({
        user,
        products,
        totalPrice,
        paymentMethod,
        orderNumber,
      });
      if (result) {
        return NextResponse.json(
          { message: "Order placed successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
