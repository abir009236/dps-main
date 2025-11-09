"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

export default function FloatingContact() {
  const [settings, setSettings] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   const fetchSettings = async () => {
    const response = await fetch("/api/admin/website-settings");
    const data = await response.json();
    setSettings(data);
    setIsLoading(false);
   };
   fetchSettings();
  }, []);

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("WhatsApp clicked!");

    if (settings?.whatsappNumber) {
      const phoneNumber = settings.whatsappNumber.replace(/[^\d]/g, "");
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello! I'm interested in your digital products.`;
      console.log("Opening WhatsApp URL:", whatsappUrl);
      window.open(whatsappUrl, "_blank");
    } else {
      alert("WhatsApp number not configured.");
    }
  };

  const handleTelegramClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Telegram clicked!");

    if (settings?.telegramNumber) {
      const telegramUrl = `https://t.me/${settings.telegramNumber}`;
      console.log("Opening Telegram URL:", telegramUrl);
      window.open(telegramUrl, "_blank");
    } else {
      alert("Telegram number not configured.");
    }
  };

  const handleMainButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Main button clicked! Current state:", isExpanded);
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Contact Button */}
      <div className="relative">
        <button
          onClick={handleMainButtonClick}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex flex-col items-center justify-center text-white font-bold cursor-pointer border-0"
        >
          <span className="text-2xl mb-0.5">💬</span>
          <span className="text-xs">Chat</span>
        </button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none"></div>
      </div>

      {/* Expanded Contact Options */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 space-y-4">
          {/* WhatsApp Option */}
          <div className="w-72 shadow-2xl bg-white rounded-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br bg-green-400 text-white rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">WhatsApp</h3>
                  <p className="text-sm text-gray-600">
                    Quick support & instant replies
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Online now
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0 cursor-pointer"
                >
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Telegram Option */}
          <div className="w-72 shadow-2xl bg-white rounded-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br bg-blue-400 text-white rounded-full flex items-center justify-center">
                  <FaTelegram className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Telegram</h3>
                  <p className="text-sm text-gray-600">
                    Secure messaging & files
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-medium">
                      Available
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleTelegramClick}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0 cursor-pointer"
                >
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="hidden lg:block w-72 shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl overflow-hidden">
            <div className="p-5">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <span className="px-4 py-2 text-sm font-bold bg-white/80 text-gray-700 rounded-full">
                    💬 Contact Us
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We're here to help! Choose your preferred way to reach us for
                  instant support.
                </p>
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>24/7 Support</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Quick Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Button when expanded */}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0 cursor-pointer flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
}
