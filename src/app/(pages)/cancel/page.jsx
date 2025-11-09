"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CancelPayment() {
  return (
    <div className="container mx-auto md:my-20 px-4 py-16 text-center">
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-2xl font-bold text-red-700">Payment Canceled</h1>
        <p className="mt-2 text-gray-700">
          Your payment was canceled. You can try again or return to the shop.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop">
            <Button variant="secondary" className="text-white cursor-pointer">Back to Shop</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
