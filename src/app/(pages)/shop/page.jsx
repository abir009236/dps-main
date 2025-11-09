"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import ProductCard from "@/components/ProductCard/ProductCard";
import GridLayout from "@/components/GridLayout/GridLayout";
import SortDropdown from "@/components/SortDropdown/SortDropdown";
import { useQuery } from "@tanstack/react-query";

export default function Shop() {
  const [gridLayout, setGridLayout] = useState("grid-3");
  const [sortBy, setSortBy] = useState("default");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const activeCategory = categoryParam || null;

  const { data: products, isLoading } = useQuery({
    queryKey: ["products_admin"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      return data;
    },
  });

  const sortedProducts = useMemo(() => {
    if (!products) return [];

    let base = activeCategory
      ? products.filter((p) => (p.category || "").toString() === activeCategory)
      : products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      base = base.filter((p) => {
        const title = (p.title || "").toLowerCase();
        const details = Array.isArray(p.details)
          ? p.details.join(" ").toLowerCase()
          : "";
        return title.includes(q) || details.includes(q);
      });
    }

    let sorted = [...base];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => {
          const priceA =
            a.pricingType === "fixed"
              ? a.fixedPrice
              : a.durationBasedPricing?.length > 0
              ? Math.min(...a.durationBasedPricing.map((p) => p.price))
              : 0;
          const priceB =
            b.pricingType === "fixed"
              ? b.fixedPrice
              : b.durationBasedPricing?.length > 0
              ? Math.min(...b.durationBasedPricing.map((p) => p.price))
              : 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        sorted.sort((a, b) => {
          const priceA =
            a.pricingType === "fixed"
              ? a.fixedPrice
              : a.durationBasedPricing?.length > 0
              ? Math.min(...a.durationBasedPricing.map((p) => p.price))
              : 0;
          const priceB =
            b.pricingType === "fixed"
              ? b.fixedPrice
              : b.durationBasedPricing?.length > 0
              ? Math.min(...b.durationBasedPricing.map((p) => p.price))
              : 0;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order
        break;
    }

    return sorted;
  }, [products, sortBy, activeCategory, searchQuery]);

  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2";
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";
      case "grid-4":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mb-10">
      <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              {activeCategory
                ? `${activeCategory} Products`
                : searchQuery
                ? `Results for "${searchQuery}"`
                : "All Products"}
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Discover our premium digital products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 items-stretch sm:items-center">
            <SortDropdown onSortChange={setSortBy} />
            <GridLayout onLayoutChange={setGridLayout} />
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${getGridClasses()}`}>
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              Check back later for new products!
            </p>
          </div>
        )}

        {/* Results Count */}
        {sortedProducts.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-gray-600">
            Showing {sortedProducts.length} product
            {sortedProducts.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
