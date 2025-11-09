"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPayment() {
  return (
    <div className="container mx-auto md:my-20 flex items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-xl rounded-xl border border-green-200 bg-green-50 p-8">
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful
        </h1>
        <p className="mt-2 text-gray-700">
          Thank you! Your payment has been received and your order is being
          processed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shop">
            <Button variant="primary" className="cursor-pointer">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="secondary" className="text-white cursor-pointer">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
