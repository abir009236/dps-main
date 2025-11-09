"use client";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/Loading";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Checkout() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [items, setItems] = useState([]);
  const [config, setConfig] = useState(null);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    notes: "",
    paymentMethod: "",
    bkashNumber: "",
    rocketNumber: "",
    nagadNumber: "",
    uddoktapayApiKey: "",
    bkashTxnId: "",
    rocketTxnId: "",
    nagadTxnId: "",
    uddoktapayTxnId: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  // Prefill form from session once when session becomes available
  useEffect(() => {
    if (session) {
      setForm((prev) => ({
        ...prev,
        name: session?.name || prev.name,
        whatsapp: session?.phone || prev.whatsapp,
        email: session?.email || prev.email,
      }));
    }
  }, [session]);

  // Avoid hydration mismatch: render only after mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load wallet config and cart in parallel
  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        setLoading(true);
        const userId = session?._id || session?.id;

        const cartPromise = userId
          ? fetch(`/api/cart?userId=${userId}`)
              .then((r) => r.json())
              .then((d) => d?.cart?.products || [])
          : Promise.resolve(
              JSON.parse(
                typeof window !== "undefined"
                  ? localStorage.getItem("cart") || "[]"
                  : "[]"
              )
            );

        const walletPromise = fetch("/api/admin/wallet").then((r) => r.json());

        const [cartItems, wallet] = await Promise.all([
          cartPromise,
          walletPromise,
        ]);

        if (!cancelled) {
          setItems(cartItems);
          if (wallet?.success) setConfig(wallet.wallet);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [items]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Helpers to reduce duplication
  const resetAfterOrder = () => {
    setForm({
      paymentMethod: "",
      bkashNumber: "",
      rocketNumber: "",
      nagadNumber: "",
      uddoktapayApiKey: "",
      bkashTxnId: "",
      rocketTxnId: "",
      nagadTxnId: "",
      uddoktapayTxnId: "",
      acceptTerms: false,
      name: form.name,
      whatsapp: form.whatsapp,
      email: form.email,
      notes: form.notes,
    });
    setErrors({});
    setItems([]);
    setConfig(null);
  };

  const commonSuccess = (message) => {
    toast.success(message);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
    resetAfterOrder();
    setIsPlacingOrder(false);
    router.push("/orders");
  };

  const paymentFields = {
    bkash: { number: "bkashNumber", txn: "bkashTxnId", label: "Bkash" },
    rocket: { number: "rocketNumber", txn: "rocketTxnId", label: "Rocket" },
    nagad: { number: "nagadNumber", txn: "nagadTxnId", label: "Nagad" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.name) {
      setErrors({ ...errors, name: "Name is required" });
      return;
    }
    if (!form.email) {
      setErrors({ ...errors, email: "Email is required" });
      return;
    }
    if (!form.whatsapp) {
      setErrors({ ...errors, whatsapp: "Whatsapp number is required" });
      return;
    }

    const allProduct = items.map(({ _id, ...rest }) => rest);
    setErrors({});
    if (form.paymentMethod === "") {
      setErrors({ ...errors, paymentMethod: "Payment method is required" });
      return;
    } else if (form.acceptTerms == false) {
      setErrors({
        ...errors,
        acceptTerms: "You must accept the terms and conditions",
      });
      return;
    } else if (paymentFields[form.paymentMethod]) {
      const meta = paymentFields[form.paymentMethod];
      if (!form[meta.number]) {
        setErrors({
          ...errors,
          [meta.number]: `${meta.label} number is required`,
        });
        return;
      }
      if (!form[meta.txn]) {
        setErrors({
          ...errors,
          [meta.txn]: `${meta.label} transaction ID is required`,
        });
        return;
      }
      setIsPlacingOrder(true);
      const response = await fetch("/api/users/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: session._id,
          products: allProduct,
          totalPrice: subtotal,
          paymentMethod: form.paymentMethod,
          manualPaymentMethod: {
            senderNumber: form[meta.number],
            senderTransactionId: form[meta.txn],
          },
          items,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        commonSuccess(data?.message);
      } else {
        toast.error(data?.error);
        setIsPlacingOrder(false);
      }
    } else if (form.paymentMethod === "uddoktapay") {
      form.uddoktapayApiKey = config?.uddoktapay?.apiKey;
      setIsPlacingOrder(true);
      const response = await fetch("/api/users/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: session._id,
          products: allProduct,
          totalPrice: subtotal,
          paymentMethod: form.paymentMethod,
          uddoktapayApiKey: form.uddoktapayApiKey,
          name: form.name,
          email: form.email,
          items,
        }),
      });
      const data = await response.json();
      if (response.ok && data?.payment_url) {
        setIsPlacingOrder(false);
        router.push(data?.payment_url);
      }
      if (!response.ok) {
        toast.error(data?.error || "Failed to initialize payment");
      }
    } else if (form.paymentMethod === "refund-balance") {
      setIsPlacingOrder(true);
      const response = await fetch("/api/users/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: session._id,
          products: allProduct,
          totalPrice: subtotal,
          paymentMethod: form.paymentMethod,
          items,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        commonSuccess(data?.message);
      } else {
        toast.error(data?.error);
        setIsPlacingOrder(false);
      }
    }
  };

  if (!mounted || loading) return <Loading />;

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
          <div className="absolute inset-y-0 left-0 right-0 bg-primary/50" />
        </div>
        <div className="flex items-center gap-2 text-primary">
          <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
            2
          </div>
          <span className="font-semibold">Checkout</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Billing Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 max-h-96">
          <h2 className="text-lg font-bold mb-4">Billing Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Whatsapp number (With country code) *
              </label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="8801XXXXXXXXX"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email address *
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Your Order */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 h-max">
          <h2 className="text-lg font-bold mb-4">Your Order</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
              <span>Product</span>
              <span>Subtotal</span>
            </div>
            <div className="border-t border-gray-200" />

            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between text-sm"
              >
                <div className="flex-1 pr-4">
                  <div className="font-medium truncate">{item.productName}</div>
                </div>
                <div className="whitespace-nowrap font-medium">
                  {Number(item.price) * Number(item.quantity)} ৳
                </div>
              </div>
            ))}

            <div className="border-t border-gray-200" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{subtotal} ৳</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-semibold">0 ৳</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-primary">
              <span>Total</span>
              <span className="text-xl">{subtotal} ৳</span>
            </div>

            {/* Payment Methods */}
            <div className="mt-4 space-y-3">
              {config?.bkash?.enabled && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={form.paymentMethod === "bkash"}
                    onChange={handleChange}
                  />
                  Bkash Send Money{" "}
                  <span>
                    {" "}
                    <Image
                      src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg"
                      alt="bkash"
                      width={50}
                      height={40}
                    />{" "}
                  </span>
                </label>
              )}
              {config?.rocket?.enabled && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="rocket"
                    checked={form.paymentMethod === "rocket"}
                    onChange={handleChange}
                  />
                  Rocket Send Money{" "}
                  <span>
                    {" "}
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Rocket_ddbl.png"
                      alt="rocket"
                      width={50}
                      height={40}
                    />{" "}
                  </span>
                </label>
              )}
              {config?.nagad?.enabled && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={form.paymentMethod === "nagad"}
                    onChange={handleChange}
                  />
                  Nagad Send Money{" "}
                  <span>
                    {" "}
                    <Image
                      src="https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg"
                      alt="rocket"
                      width={70}
                      height={40}
                    />{" "}
                  </span>
                </label>
              )}

              {config?.uddoktapay?.enabled && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="uddoktapay"
                    checked={form.paymentMethod === "uddoktapay"}
                    onChange={handleChange}
                  />
                  Uddoktapay{" "}
                  <span>
                    {" "}
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsP9tEf-ZJ-KQZWOfG4cVNdi5BgVi3WbFDNg&s"
                      alt="rocket"
                      width={40}
                      height={40}
                    />{" "}
                  </span>
                </label>
              )}

              {session?.refundBalance > 0 && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="refund-balance"
                    checked={form.paymentMethod === "refund-balance"}
                    onChange={handleChange}
                  />
                  Refund Balance
                  <span className="text-primary font-bold text-xl ml-2">
                    {" "}
                    {session?.refundBalance} ৳{" "}
                  </span>
                </label>
              )}

              {(form.paymentMethod === "bkash" ||
                form.paymentMethod === "rocket" ||
                form.paymentMethod === "nagad") && (
                <div className="mt-2 space-y-3 text-sm">
                  <p className="text-gray-600 font-bold">
                    Please complete your Send Money first, then complete the
                    form below. Without payment, the order will be automatically
                    canceled.
                  </p>
                  {(() => {
                    const pm = form.paymentMethod;
                    const isBkash = pm === "bkash";
                    const isRocket = pm === "rocket";
                    const isNagad = pm === "nagad";
                    const numberField = isBkash
                      ? "bkashNumber"
                      : isRocket
                      ? "rocketNumber"
                      : "nagadNumber";
                    const txnField = isBkash
                      ? "bkashTxnId"
                      : isRocket
                      ? "rocketTxnId"
                      : "nagadTxnId";
                    const methodLabel = isBkash
                      ? "bKash"
                      : isRocket
                      ? "Rocket"
                      : "Nagad";
                    const configuredNumber = isBkash
                      ? config?.bkash?.number
                      : isRocket
                      ? config?.rocket?.number
                      : config?.nagad?.number;
                    return (
                      <>
                        <div>
                          <label className="block mb-1">
                            {methodLabel} Personal Number :{" "}
                            <span className="text-primary font-bold text-xl ml-2">
                              {configuredNumber}
                            </span>
                          </label>
                        </div>
                        <div>
                          <label className="block mb-1">
                            {methodLabel} Number (From The Number You Make Send
                            Money)
                          </label>
                          <input
                            name={numberField}
                            value={form[numberField]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="01XXXXXXXXX"
                          />
                          {errors[numberField] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[numberField]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1">
                            {methodLabel} Transaction ID
                          </label>
                          <input
                            name={txnField}
                            value={form[txnField]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Transaction ID"
                          />
                          {errors[txnField] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[txnField]}
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMethod}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <input
                id="acceptTerms"
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="acceptTerms" className="font-bold">
                I have read and agree to the website Terms & Conditions, Privacy
                Policy, Return/Refund Policy
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
            )}

            {errors.items && (
              <p className="text-red-500 text-sm mt-2">{errors.items}</p>
            )}
            <p className="text-center text-red-500 font-bold">
              অর্ডারের পরে আমাদের ওয়েবসাইট Dashboard এ অর্ডারটি ডেলিভারি হবে।
              ইমেইলের মাধ্যমে ডেলিভারি করা হবে না।
            </p>
            <Button type="submit" className="w-full mt-4" variant="primary">
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
