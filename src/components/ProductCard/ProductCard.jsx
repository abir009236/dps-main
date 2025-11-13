"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const getDisplayPrice = () => {
    if (product.pricingType === "fixed") {
      return `${product.fixedPrice} ৳`;
    } else if (
      product.pricingType === "duration" &&
      product.durationBasedPricing?.length > 0
    ) {
      const minPrice = Math.min(
        ...product.durationBasedPricing.map((p) => p.price)
      );

      const maxPrice = Math.max(
        ...product.durationBasedPricing.map((p) => p.price)
      );

      return `${minPrice} - ${maxPrice} ৳`;
    }
    return "Price on request";
  };

  return (
    <Link href={`/shop/${product._id}`}>
      <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl mt-0">
        {/* Image Container with Padding */}
        <div className="relative px-4">
          <div className="aspect-square relative overflow-hidden rounded-xl">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {product.availability === "out_of_stock" && (
            <div className="absolute inset-4 bg-black/70 flex items-center justify-center rounded-xl h-full top-0">
              <span className="text-red-500 font-bold text-5xl">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="px-6 pb-6">
          <div className="space-y-3">
            {/* Product Title */}
            <Link
              href={`/shop/${product._id}`}
              className="font-bold text-gray-900 text-2xl line-clamp-2 group-hover:text-primary transition-colors leading-tight hover:text-primary"
            >
              {product.title}
            </Link>

            {/* Price and Category */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">
                {getDisplayPrice()}
              </span>
              {product.category && (
                <span className="text-sm text-blue-500 bg-blue-100 px-3 py-1.5 font-semibold rounded-full">
                  {product.category}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
