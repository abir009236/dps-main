"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";

export default function ViewCart() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(
    async (options = { showLoader: false }) => {
      const { showLoader } = options || {};
      try {
        if (showLoader) setLoading(true);
        if (session?._id || session?.id) {
          const userId = session?._id || session?.id;
          const res = await fetch(`/api/cart?userId=${userId}`);
          const data = await res.json();
          setItems(data?.cart?.products || []);
        } else {
          const ls = JSON.parse(localStorage.getItem("cart") || "[]");
          setItems(ls);
        }
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [session]
  );

  useEffect(() => {
    loadCart({ showLoader: true });
  }, [loadCart]);

  const handleUpdateQty = async (cartId, nextQty) => {
    if (session?._id || session?.id) {
      const res = await fetch(
        `/api/products/${session?._id || session?.id}?cartId=${cartId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: nextQty }),
        }
      );
      if (!res.ok) return;
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      const ls = JSON.parse(localStorage.getItem("cart") || "[]");
      const updated = ls
        .map((p) => (p._id === cartId ? { ...p, quantity: nextQty } : p))
        .filter((p) => p.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      setItems(updated);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleRemove = async (cartId) => {
    if (session?._id || session?.id) {
      await fetch(
        `/api/products/${session?._id || session?.id}?cartId=${cartId}`,
        {
          method: "DELETE",
        }
      );
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      const ls = JSON.parse(localStorage.getItem("cart") || "[]");
      const updated = ls.filter((p) => p._id !== cartId);
      localStorage.setItem("cart", JSON.stringify(updated));
      setItems(updated);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [items]
  );

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-center gap-24 mb-10">
        <div className="flex items-center gap-2 text-primary">
          <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
            1
          </div>
          <span className="font-semibold">Cart</span>
        </div>
        <div className="w-64 h-1 bg-gray-200 relative">
          <div className="absolute inset-y-0 left-0 right-0 bg-gray-300" />
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
            2
          </div>
          <span className="font-semibold">Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-300">
          {/* Desktop / Tablet header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-4 text-sm font-semibold text-gray-600">
            <div className="col-span-2">Image</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-1">Sub Total</div>
            <div className="col-span-1">Action</div>
          </div>
          <div className="hidden md:block border-t border-gray-300" />

          {/* Desktop / Tablet rows */}
          <div className="hidden md:block">
            {items?.length > 0 &&
              items?.map((item) => (
                <div
                  key={item?._id}
                  className="grid grid-cols-12 px-6 py-5 items-center"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                      {item?.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item?.productImage}
                          alt={item?.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-4 text-sm">
                    <div className="font-semibold">{item?.productName}</div>
                  </div>
                  <div className="col-span-2 font-medium">
                    {Number(item?.price)} ৳
                  </div>
                  <div className="col-span-2">
                    <div className="inline-flex items-center border border-gray-300 rounded-full">
                      <button
                        className="px-3 py-1 text-lg cursor-pointer"
                        onClick={() =>
                          handleUpdateQty(item?._id, (item?.quantity || 1) - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-4 select-none">{item?.quantity}</span>
                      <button
                        className="px-3 py-1 text-lg cursor-pointer"
                        onClick={() =>
                          handleUpdateQty(item?._id, (item?.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-1 font-bold text-primary">
                    {Number(item?.price) * Number(item?.quantity)} ৳
                  </div>
                  <div className="col-span-1">
                    <button
                      className="text-red-500 text-sm inline-flex items-center gap-1 cursor-pointer"
                      onClick={() => handleRemove(item?._id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Mobile rows */}
          <div className="md:hidden divide-y">
            {items?.length > 0 &&
              items?.map((item) => (
                <div key={item?._id} className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                      {item?.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item?.productImage}
                          alt={item?.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold leading-snug">
                          {item?.productName}
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                          onClick={() => handleRemove(item?._id)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Price:{" "}
                        <span className="font-medium">
                          {Number(item?.price)} ৳
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-gray-300 rounded-full">
                          <button
                            className="px-3 py-1 text-lg cursor-pointer"
                            onClick={() =>
                              handleUpdateQty(
                                item?._id,
                                (item?.quantity || 1) - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-4 select-none">
                            {item?.quantity}
                          </span>
                          <button
                            className="px-3 py-1 text-lg cursor-pointer"
                            onClick={() =>
                              handleUpdateQty(
                                item?._id,
                                (item?.quantity || 1) + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="font-bold text-primary">
                          {Number(item?.price) * Number(item?.quantity)} ৳
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {items?.length === 0 && (
              <div className="px-4 py-10 text-gray-500">
                Your cart is empty.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 h-max p-6">
          <h3 className="text-xl font-bold mb-6">CART TOTALS</h3>
          <div className="flex items-center justify-between py-3 border-b border-gray-300">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{subtotal} ৳</span>
          </div>
          <div className="flex items-center justify-between py-4 text-2xl font-bold text-primary">
            <span>Total</span>
            <span>{subtotal} ৳</span>
          </div>
          <Button
            className="w-full rounded-full text-white py-4 font-semibold cursor-pointer"
            variant="primary"
            onClick={() => router.push("/checkout")}
          >
            PROCEED TO CHECKOUT
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="inline-flex items-center gap-2 text-gray-700 cursor-pointer"
          onClick={() => router.push("/shop")}
        >
          ← Continue To Shopping
        </button>
      </div>
    </div>
  );
}
