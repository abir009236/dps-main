import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Wallet from "@/models/Wallet";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoice_id");

    const walletInfo = await Wallet.findOne({ uddoktapay: { $exists: true } });

    if (walletInfo) {
      const uddoktaPayapiKey = walletInfo?.uddoktapay?.apiKey;

      const response = await fetch(
        `${process.env.UDDOKTAPAY_API_URL}/api/verify-payment`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "RT-UDDOKTAPAY-API-KEY": uddoktaPayapiKey,
          },
          body: JSON.stringify({
            invoice_id: invoiceId,
          }),
        }
      );
      const data = await response.json();
      const order_id = data?.metadata?.order_id;
      const order = await Order.findOne({
        orderNumber: order_id,
        paymentMethod: "uddoktapay",
      });
      if (data.status === "PENDING") {
        order.uddoktaPay.status = "pending";
        order.uddoktaPay.invoiceId = invoiceId;
        await order.save();
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/pending`
        );
      } else if (data.status === "COMPLETED") {
        order.uddoktaPay.status = "success";
        order.uddoktaPay.invoiceId = invoiceId;
        await order.save();
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/success`
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
