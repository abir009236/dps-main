"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WhyChooseUs() {
  const features = [
    {
      id: 1,
      title: "DBID Verified Shop",
      description:
        "Our Site earned DBID verification from Ministry of Commerce",
      icon: "🏛️",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Verified Payment Gateway",
      description:
        "Our site has verified merchant payment for bKash, Nagad, Rocket, Upay",
      icon: "💳",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      title: "5 Years of Expertise",
      description: "We have 5 years of experience to serve our customers",
      icon: "🎯",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      title: "Faster Delivery",
      description: "We deliver the products mostly 1 hour to 3 Hours",
      icon: "⚡",
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      id: 5,
      title: "Faster Response Time",
      description: "We response typically instant in official hour",
      icon: "💬",
      color: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      id: 6,
      title: "Trustpilot: Excellent",
      description:
        "We are excellent (4.8/5) category seller based on Trustpilot reviews",
      icon: "⭐",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <section className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-semibold"
          >
            Why Choose Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Our Digital Store?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide exceptional digital products and services with unmatched
            reliability, security, and customer satisfaction that sets us apart
            from the competition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group hover:shadow-xl hover:bg-primary  transition-all duration-300 transform hover:-translate-y-2 border-1 border-gray-200 shadow-lg rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className={`text-3xl ${feature.iconColor}`}>
                      {feature.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 ">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl font-bold text-gray-400"></span>
                      <h3 className="text-xl font-bold text-gray-900 transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed ">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                500+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Digital Products
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                10K+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                5+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                4.9★
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Customer Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
