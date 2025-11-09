"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PendingPayment() {
  return (
    <div className="container mx-auto md:my-20 px-4 py-16 text-center">
      <div className="mx-auto max-w-xl rounded-xl border border-yellow-200 bg-yellow-50 p-8">
        <h1 className="text-2xl font-bold text-yellow-500">Payment Pending</h1>
        <p className="mt-2 text-gray-700">
          Your payment is pending. Please wait for the payment to be confirmed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop">
            <Button className="text-white cursor-pointer bg-yellow-500">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
