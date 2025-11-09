"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="  flex items-center justify-center mt-6 md:mt-10 lg:mt-14">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Digital
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-600">
                  {" "}
                  Premium{" "}
                </span>
                Store
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Discover premium digital products and services that elevate your
                business to new heights
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/80 cursor-pointer"
                >
                  Explore Products
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-[#00BEFA] text-[#00BEFA] hover:bg-[#00BEFA] hover:text-white cursor-pointer"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  500+
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                  10K+
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  5+
                </div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative w-full h-72 sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/image/digital-product-logo.jpg"
                alt="Digital Premium Store"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-3  lg:-top-4 lg:-left-4 bg-white rounded-2xl shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Live Support
                </span>
              </div>
            </div>

            <div className="hidden md:block absolute -botton-1  -right-1 lg:-bottom-4 lg:-right-4 bg-white rounded-2xl shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-xs text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
