import React from "react";
import { FileCheck, Mail, Headphones } from "lucide-react";

export default function ImportantNote() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Check Before Purchase */}
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-black text-base sm:text-lg mb-2">
            Check Before Purchase
          </h3>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Please Review The Subscription Details, Terms & Conditions, Refund &
            Refund Policy Before Placing An Order.
          </p>
        </div>
      </div>

      {/* Delivery Through Our Panel */}
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-bold text-black text-base sm:text-lg mb-2">
                Delivery Through Our Panel
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Once your order is processed it will be delivered to our
                customer dashboard. Avoid Urgent delivery at any Situation.
              </p>
            </div>
            <div className="sm:ml-4 sm:text-right">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                3 Hours (Within office Hours)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-bold text-black text-base sm:text-lg mb-2">
                Customer Support
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                For any services or queries, please message us on WhatsApp or
                Facebook during office hours.{" "}
                <span className="text-red-500 font-bold">
                  Kindly avoid calling.
                </span>
              </p>
            </div>
            <div className="sm:ml-4 sm:text-right">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                10.30 am - 12.30 am (GMT +6)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
