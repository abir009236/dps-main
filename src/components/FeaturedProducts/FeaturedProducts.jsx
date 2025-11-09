"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/featured-products");
        const data = await response.json();
        // Get first 6 products as featured
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className=" ">
        <div className="">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular digital products and services
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-semibold"
          >
            Featured Collection
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular digital products and services that our
            customers love
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <div key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-500">
              Check back later for amazing digital products!
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="primary">View All Products</Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Delivery
            </h3>
            <p className="text-gray-600">
              Get your digital products delivered instantly after purchase
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Payment
            </h3>
            <p className="text-gray-600">
              Safe and secure payment processing with multiple options
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-600">
              High-quality digital products from verified sellers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
