"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsStopwatch } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { Search, ShoppingCart } from "lucide-react";


const TopBar = memo(
  React.forwardRef(function TopBar(
    {
      settings,
      cartCount,
      onOpenCart,
      searchValue,
      onSearchChange,
      onSearchSubmit,
    },
    ref
  ) {
    return (
      <div ref={ref} className="bg-white  hidden lg:block">
        <div className="container mx-auto px-4 h-14 flex justify-between items-center  border-b-[1px] border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BsStopwatch className="text-gray-600" />
              <p className="text-gray-600 text-lg font-bold">
                {settings?.workingHours ||
                  "Working Hours : 10.30 AM - 12.30 AM (BST)"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CiMail className="text-gray-600 font-bold" />
              <p className="text-gray-600 text-lg font-bold">
                {settings?.email || "info@digitalpremiumstore.com"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-lg">
            <a
              href={settings?.instagramLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600  border border-gray-300  rounded-full p-2 hover:bg-primary hover:text-white transition-all duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href={settings?.linkedinLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 border border-gray-300 rounded-full p-2 hover:bg-primary hover:text-white transition-all duration-300"
            >
              <FaLinkedinIn />
            </a>
            <a
              href={settings?.facebookLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 border border-gray-300 rounded-full p-2 hover:bg-primary hover:text-white transition-all duration-300"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {settings?.websiteLogoLink ? (
                <Image
                  src={settings.websiteLogoLink}
                  alt="website logo"
                  width={80}
                  height={100}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
              )}
              {settings?.websiteName ? (
                <Link
                  href="/"
                  className="text-4xl font-extrabold bg-gradient-to-r from-[#00BEFA] to-[#88E789] bg-clip-text text-transparent"
                >
                  {settings.websiteName}
                </Link>
              ) : (
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
              )}
            </div>
            <div className="w-1/2 relative">
              <input
                type="text"
                placeholder="Search Tools"
                className="w-full p-4 border border-[#00befa] rounded-full focus:outline-none focus:ring-1  focus:ring-[#00befa]"
                value={searchValue}
                onChange={onSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearchSubmit?.();
                }}
              />
              <button
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                onClick={onSearchSubmit}
                aria-label="Search"
              >
                <Search className="text-xl" />
              </button>
            </div>
            <button
              className="flex items-center space-x-2 cursor-pointer"
              onClick={onOpenCart}
            >
              <ShoppingCart className="text-3xl" />
              <span className="font-bold relative text-lg">
                <span className="absolute -top-5 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ">
                  {cartCount}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  })
);

export default TopBar;
