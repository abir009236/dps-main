"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState({});
  useEffect(() => {
    const loadSettings = async () => {
      const res = await fetch("/api/admin/website-settings");
      const data = await res.json();
      setSettings(data || {});
    };
    loadSettings();
  }, []);
  return pathname?.includes("/admin/login") || pathname.includes("/admin") ? (
    ""
  ) : (
    <div className="bg-gray-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
      </div>

      <div className="container mx-auto py-16 px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center  gap-8  ">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-white text-2xl rounded-lg flex items-center justify-center">
                {settings?.websiteName || ""}
              </div>
            </div>

            {/* Description */}
            <p className="text-white text-sm leading-relaxed  w-full  ">
              Our Main Goal Is To Provide Essential Digital Products & Services
              At Affordable Prices. Totally Transparent & Guaranteed Service. We
              Only Sell Valid Products/ Services After Extensive Testing.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href={settings?.facebookLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href={settings?.instagramLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href={settings?.whatsappLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white text-xl font-bold">Information</h3>
            <div className="space-y-3">
              <Link
                href="/about"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>About Us</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Contact Us</span>
              </Link>
              <Link
                href="/shop"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>All Products</span>
              </Link>
              <Link
                href="/reviews"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Reviews</span>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white text-xl font-bold">Useful Links</h3>
            <div className="space-y-3">
              <Link
                href="/replace-refund-policy"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Replacement Policy</span>
              </Link>
              <Link
                href="/privacy-policy"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/replace-refund-policy"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Refund Policy</span>
              </Link>
              <Link
                href="/terms-and-condition"
                className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Terms & Conditions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
