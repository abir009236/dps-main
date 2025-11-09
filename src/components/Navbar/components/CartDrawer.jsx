"use client";

import React, { memo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

const CartDrawer = memo(function CartDrawer({
  open,
  onOpenChange,
  cartItems,
  subtotal,
  onRemove,
  onUpdateQty,
  onViewCart,
  onCheckout,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[380px] md:w-[460px] p-0 bg-white text-primary flex flex-col"
      >
        <div className="px-4 py-3 border-b">
          <SheetHeader>
            <SheetTitle className="font-bold text-2xl">
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                    {item.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold leading-snug">
                      {String(item.productName)}
                    </p>
                    <div className="mt-2 inline-flex items-center border rounded-full">
                      <button
                        className="px-3 py-1 text-lg cursor-pointer"
                        onClick={() =>
                          onUpdateQty(item._id, (item.quantity || 1) - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-4 select-none">{item.quantity}</span>
                      <button
                        className="px-3 py-1 text-lg cursor-pointer"
                        onClick={() =>
                          onUpdateQty(item._id, (item.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-semibold">
                    {Number(item.price) * Number(item.quantity)} ৳
                  </div>
                  <button
                    className="text-red-500 text-sm inline-flex items-center gap-1 cursor-pointer"
                    onClick={() => onRemove(item._id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t px-4 py-4 space-y-3">
          <div className="flex items-center justify-between text-gray-700">
            <span className="font-semibold">Subtotal</span>
            <span className="font-bold text-primary">{subtotal} ৳</span>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 cursor-pointer text-white bg-green-400"
              onClick={onViewCart}
            >
              View Cart
            </Button>
            <Button
              className="flex-1 text-white cursor-pointer"
              onClick={onCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

export default CartDrawer;
