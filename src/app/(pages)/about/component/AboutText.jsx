"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AboutText() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/website-settings");
      const data = await res.json();
      setSettings(data || {});
      setLoading(false);
    };
    loadSettings();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-primary">Loading settings...</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-3">
        About {settings?.websiteName || ""}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {settings?.websiteName || "It"} is Bangladeshs leading e-commerce
        platform for digital products, offering everything from subscriptions to
        digital keys. Since 2019, we have been devoted to making online services
        simple, secure, and accessible for everyone. Whether you are looking for
        entertainment, educational resources, or productivity solutions,
        Subscriptions BD is here to provide you with trusted digital services
        that fit your lifestyle.
      </p>

      <h1 className="mt-4 sm:mt-5 mb-3 font-bold text-base sm:text-lg md:text-xl">
        Our Commitment to Trust and Security
      </h1>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        At {settings?.websiteName || "It"}, we take your security seriously. We
        use industry-standard encryption to protect your personal information
        and payment details. Our secure checkout process ensures that your
        transactions are safe and hassle-free.
      </p>

      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        We are committed to providing a secure and reliable shopping experience.
        Our secure checkout process ensures that your transactions are safe and
        hassle-free. We use industry-standard encryption to protect your
        personal information and payment details.
      </p>

      <h1 className="mt-4 sm:mt-5 mb-3 font-bold text-base sm:text-lg md:text-xl">
        Proven Excellence and Customer Satisfaction
      </h1>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        Over the years, we have successfully processed over 50 orders through
        our website, earning the trust and loyalty of customers across the
        country. Our commitment to excellence is reflected in our outstanding
        Trustpilot rating of 4.8/5 and the numerous positive reviews on our
        Facebook fan page and group. We take immense pride in the satisfaction
        of our customers and continuously strive to exceed their expectations.
        This is our commitment to you.
        <br />
        <br />
        <span className="font-bold">
          Thank you for choosing {settings?.websiteName || "our platform"}. We
          look forward to serving you and helping you access the best services
          in the digital world.
        </span>
      </p>
    </div>
  );
}
