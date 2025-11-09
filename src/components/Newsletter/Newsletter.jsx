"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 lg:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Successfully Subscribed!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for subscribing to our newsletter. You'll receive the
                latest updates and exclusive offers.
              </p>
              <Button
                onClick={() => setIsSubscribed(false)}
                variant="outline"
                className="px-6 py-2"
              >
                Subscribe Another Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className=" relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left space-y-6">
                  <Badge
                    variant="secondary"
                    className="mb-4 px-4 py-2 text-sm font-semibold"
                  >
                    Stay Updated
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Subscribe to Our
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {" "}
                      Newsletter
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Get the latest updates on new products, exclusive offers,
                    and digital trends. Join thousands of satisfied customers
                    who stay ahead of the curve.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">
                        Weekly product updates
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">
                        Exclusive discounts & offers
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">
                        Early access to new releases
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">
                        Digital marketing tips & insights
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Newsletter Form */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Subscribing...</span>
                          </div>
                        ) : (
                          "Subscribe Now"
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👥</span>
                <span className="text-sm font-medium">10,000+ Subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📧</span>
                <span className="text-sm font-medium">Weekly Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎁</span>
                <span className="text-sm font-medium">Exclusive Offers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
