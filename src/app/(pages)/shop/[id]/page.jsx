"use client";
import Loading from "@/components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import ImportantNote from "./component/ImportantNote";
import TermsReplaceRefund from "./component/Terms_Replace_Refund";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function ProductDetails() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [agreedToDetails, setAgreedToDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inputValues, setInputValues] = useState({});
  const [inputError, setInputError] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      return data;
    },
    enabled: !!id,
  });
  const sortedDurationPricing = useMemo(() => {
    if (!product?.durationBasedPricing?.length) return [];
    return [...product.durationBasedPricing].sort(
      (a, b) => a.months - b.months
    );
  }, [product]);

  useEffect(() => {
    if (sortedDurationPricing.length > 0) {
      setSelectedDuration(sortedDurationPricing[0]);
    }
  }, [sortedDurationPricing]);

  if (isLoading) return <Loading />;

  const validateInputs = () => {
    if (!product?.customerInputRequirements?.length) {
      setInputError("");
      return true;
    }
    const allFilled = product.customerInputRequirements.every((req) => {
      const value = inputValues[req.label];
      return value !== undefined && String(value).trim().length > 0;
    });
    if (!allFilled) {
      setInputError("First fill the input field");
      return false;
    }
    setInputError("");
    return true;
  };

  const onAddToCart = async () => {
    if (!validateInputs()) return;
    const cartItem = {
      productId: product._id,
      quantity,
      productName: product.title,
      price:
        product.pricingType === "fixed"
          ? product.fixedPrice
          : selectedDuration?.price || product.durationBasedPricing?.[0]?.price,
      extraFields: inputValues,
      productImage: product.image,
    };
    if (!session?._id) {
      router.push("/login");
      return;
    } else {
      const response = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session._id, product: cartItem }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
        }
        setInputValues({});
        setQuantity(1);
        setAgreedToDetails(false);
      } else {
        toast.error(data?.error);
        setInputValues({});
        setQuantity(1);
        setAgreedToDetails(false);
      }
    }
  };

  const onBuyNow = async () => {
    if (!validateInputs()) return;
    if (!session?._id) {
      router.push("/login");
      return;
    }
    // ensure item in cart (optional) then go to checkout
    await onAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="my-10">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 ">
        <Image
          src={product?.image}
          alt={product?.title}
          width={1000}
          height={1000}
          className="lg:w-1/3 h-[450px] object-cover rounded-lg"
        />
        <div className="space-y-3  w-full lg:w-2/3">
          <h1 className="font-semibold text-lg text-black flex items-center gap-1">
            <Link
              href={`/shop`}
              className="hover:text-primary transition-all duration-300"
            >
              Shop
            </Link>
            <MdKeyboardArrowRight />
            <Link
              href={`/shop?category=${product?.category}`}
              className="hover:text-primary transition-all duration-300"
            >
              {product?.category}
            </Link>
            <MdKeyboardArrowRight />
            {product?.subcategory && <MdKeyboardArrowRight />} {product?.title}
          </h1>

          <h1 className="text-4xl font-bold">{product?.title}</h1>
          <h1 className="text-2xl font-bold text-primary">
            {product?.pricingType === "fixed"
              ? `${product?.fixedPrice} ৳`
              : `${Math.min(
                  ...product?.durationBasedPricing.map((p) => p.price)
                )} ৳ - ${Math.max(
                  ...product?.durationBasedPricing.map((p) => p.price)
                )} ৳`}
          </h1>
          <p className="font-medium">Details : </p>
          <ul className="list-disc list-inside">
            {product?.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
          {sortedDurationPricing.length > 0 && (
            <div className="space-y-3">
              <span className="font-medium">Package Duration and Type:</span>
              <span className="flex flex-wrap gap-3 mt-2">
                {sortedDurationPricing.map((pricing, index) => {
                  const isActive = selectedDuration?.months === pricing.months;
                  return (
                    <button
                      key={`${pricing.months}-${pricing.price}-${index}`}
                      type="button"
                      onClick={() => setSelectedDuration(pricing)}
                      className={
                        `rounded-full px-4 py-2 text-sm transition-colors ` +
                        (isActive
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-black hover:bg-gray-300")
                      }
                    >
                      {pricing.months === 1
                        ? "1 Month Individual Account"
                        : `${pricing.months} Months Enterprise Account`}
                    </button>
                  );
                })}
              </span>

              <div>
                <span className="font-medium">
                  Variant wise Extra Details :
                </span>
                <p className="mt-1">
                  {selectedDuration
                    ? `${selectedDuration.months} months Enterprise Subscription on customer email`
                    : "Select a duration to see details"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-xl">Price:</span>
                <span className="mt-1 text-xl font-bold text-primary">
                  {selectedDuration
                    ? `${selectedDuration.price} ৳`
                    : "Select a duration"}
                </span>
              </div>
            </div>
          )}

          {product?.customerInputRequirements.length > 0 && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              {product.customerInputRequirements.map((requirement, index) => (
                <div key={`req-${index}-${requirement.label}`}>
                  <Label className="mb-1">
                    {requirement.label}{" "}
                    <span className="text-red-500 text-xl">*</span>
                  </Label>
                  <Input
                    type={requirement.type}
                    placeholder={requirement.label}
                    className="w-full"
                    value={inputValues[requirement.label] || ""}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        [requirement.label]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToDetails}
                onChange={(e) => setAgreedToDetails(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-black">
                I have checked and agree with the product details
              </span>
            </label>
          </div>
          {product.availability === "in_stock" ? (
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg"
                >
                  -
                </button>
                <div className="px-4 py-2 select-none">{quantity}</div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="px-4 py-2 text-lg"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={!agreedToDetails}
                className={`rounded-full px-6 py-3 font-semibold text-white ${
                  agreedToDetails
                    ? "bg-primary cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={onAddToCart}
              >
                ADD TO CART
              </button>

              <button
                type="button"
                disabled={!agreedToDetails}
                className={`rounded-full px-6 py-3 font-semibold text-white ${
                  agreedToDetails
                    ? "bg-primary cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={onBuyNow}
              >
                BUY NOW
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-red-500 text-lg font-semibold">
                This product is out of stock.
              </p>
            </div>
          )}
          {inputError && (
            <p className="text-red-500 text-sm mt-2">{inputError}</p>
          )}
        </div>
      </div>

      {/* Important Note Section */}
      <div className="mt-8">
        <ImportantNote />
      </div>

      {/* Terms & Refund Policy Section */}
      <div className="mt-6">
        <TermsReplaceRefund />
      </div>

      <div className="flex flex-col gap-2 items-center justify-center mt-6">
        <h1 className="text-2xl font-bold">
          {" "}
          Category : <span className="text-primary">{product?.category}</span>
        </h1>
        <div className="flex items-center gap-4 text-xl">
          <h1>Shares : </h1>
          <p className="hover:text-primary transition-all duration-300 cursor-pointer">
            <FaFacebook />
          </p>
          <p className="hover:text-primary transition-all duration-300 cursor-pointer">
            <FaInstagram />
          </p>
          <p className="hover:text-primary transition-all duration-300 cursor-pointer">
            <FaWhatsapp />
          </p>
        </div>
      </div>
    </div>
  );
}
