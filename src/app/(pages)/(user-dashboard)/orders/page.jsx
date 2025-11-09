"use client";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaCartPlus, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Orders() {
  const { data: session } = useSession();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders_urser", session?._id],
    queryFn: async () => {
      const res = await fetch(`/api/users/orders?userId=${session?._id}`);
      const data = await res.json();
      return data;
    },
    enabled: !!session?._id,
  });
  if (isLoading) return <Loading />;

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "bkash":
        return "bg-pink-100 text-pink-800 border-pink-200 px-2 py-1 rounded-full";
      case "rocket":
        return "bg-purple-100 text-purple-800 border-purple-200 px-2 py-1 rounded-full";
      case "nagad":
        return "bg-orange-100 text-orange-800 border-orange-200 px-2 py-1 rounded-full";
      case "uddoktapay":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 px-2 py-1 rounded-full";
      case "refund-balance":
        return "bg-blue-100 text-blue-800 border-blue-200 px-2 py-1 rounded-full";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 rounded-full";
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
          Order Summary
        </h2>
        <Link href="/delivered-products">
          <Button variant="primary" className="w-full sm:w-auto">
            <FaCartPlus className="mr-2" /> View Deliveries
          </Button>
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SL</TableHead>
              <TableHead>Product name</TableHead>
              <TableHead>Order no</TableHead>
              <TableHead>Total Item</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-black font-medium">
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <TableRow key={order._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {order.products?.map((product, idx) => (
                      <div key={idx} className="text-sm">
                        {product.productName}
                        {idx < order.products.length - 1 && ", "}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.orderNumber || "N/A"}</TableCell>
                  <TableCell>{order.products?.length || 0}</TableCell>
                  <TableCell>৳ {order.totalPrice || 0}</TableCell>
                  <TableCell>
                    <span
                      className={getPaymentMethodColor(order.paymentMethod)}
                    >
                      {order.paymentMethod.toUpperCase() || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "refunded"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "pending"
                        ? "Pending"
                        : order.status === "delivered"
                        ? "Delivered"
                        : order.status === "cancelled"
                        ? "Cancelled"
                        : order.status === "refunded"
                        ? "Refunded"
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell className="cursor-pointer font-bold">
                    {order.status == "cancelled" ||
                    order.status == "pending" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
                              Order Summary
                            </DialogTitle>
                          </DialogHeader>

                          {selectedOrder && (
                            <div className="space-y-4 sm:space-y-6">
                              {/* Order Number */}
                              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                                  Order Information
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600">
                                  <span className="font-medium">
                                    Order Number:
                                  </span>{" "}
                                  {selectedOrder.orderNumber}
                                </p>
                              </div>

                              {/* Products */}
                              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                                  Products (
                                  {selectedOrder.products?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                  {selectedOrder.products?.map(
                                    (product, idx) => (
                                      <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-md border gap-2"
                                      >
                                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                                          {product.productName}
                                        </span>
                                        <span className="text-gray-600 text-sm sm:text-base">
                                          ৳{product.price}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Payment Details */}
                              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                                  Payment Details
                                </h3>
                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                  <div>
                                    <p className="text-sm sm:text-base text-gray-600">
                                      <span className="font-medium">
                                        Method:
                                      </span>{" "}
                                      {selectedOrder.paymentMethod?.toUpperCase()}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-600">
                                      <span className="font-medium">
                                        Total:
                                      </span>{" "}
                                      ৳{selectedOrder.totalPrice}
                                    </p>
                                  </div>

                                  {/* Uddoktapay specific details */}
                                  {selectedOrder.paymentMethod ===
                                    "uddoktapay" &&
                                    selectedOrder.uddoktaPay && (
                                      <div className="bg-white p-3 rounded-md border">
                                        <p className="text-xs sm:text-sm text-gray-800 font-medium">
                                          <span className="font-medium">
                                            Invoice ID:
                                          </span>{" "}
                                          {selectedOrder.uddoktaPay.invoiceId ||
                                            "N/A"}
                                        </p>
                                      </div>
                                    )}

                                  {/* Manual payment details */}
                                  {selectedOrder.manualPaymentMethod && (
                                    <div className="bg-white p-3 rounded-md border">
                                      <p className="text-xs sm:text-sm text-gray-800">
                                        <span className="font-medium">
                                          Sender Number:
                                        </span>{" "}
                                        {
                                          selectedOrder.manualPaymentMethod
                                            .senderNumber
                                        }
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-800">
                                        <span className="font-medium">
                                          Transaction ID:
                                        </span>{" "}
                                        {
                                          selectedOrder.manualPaymentMethod
                                            .senderTransactionId
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Status and Cancel Reason */}
                              <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                                  Order Status
                                </h3>
                                <div className="flex items-center gap-3 mb-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                      selectedOrder.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : selectedOrder.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : selectedOrder.status === "delivered"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {selectedOrder.status === "cancelled"
                                      ? "Cancelled"
                                      : selectedOrder.status === "pending"
                                      ? "Pending"
                                      : selectedOrder.status === "delivered"
                                      ? "Delivered"
                                      : "Processing"}
                                  </span>
                                </div>

                                {selectedOrder.status === "cancelled" && (
                                  <div className="bg-white p-3 rounded-md border border-red-200">
                                    <p className="text-xs sm:text-sm text-gray-600">
                                      <span className="font-medium text-red-700">
                                        Cancel Reason:
                                      </span>
                                      <span className="ml-2 text-red-600">
                                        {selectedOrder.cancelReason ||
                                          "No reason provided"}
                                      </span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 mb-10">
        {orders?.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order._id || index}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Order #{order.orderNumber || "N/A"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {order.products?.length || 0} items
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : order.status === "refunded"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status === "pending"
                    ? "Pending"
                    : order.status === "delivered"
                    ? "Delivered"
                    : order.status === "cancelled"
                    ? "Cancelled"
                    : order.status === "refunded"
                    ? "Refunded"
                    : ""}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {order.products?.slice(0, 2).map((product, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    {product.productName}
                  </div>
                ))}
                {order.products?.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{order.products.length - 2} more items
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800">
                    ৳{order.totalPrice || 0}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPaymentMethodColor(
                      order.paymentMethod
                    )}`}
                  >
                    {order.paymentMethod?.toUpperCase() || "N/A"}
                  </span>
                </div>

                {(order.status === "cancelled" ||
                  order.status === "pending") && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
                          Order Summary
                        </DialogTitle>
                      </DialogHeader>

                      {selectedOrder && (
                        <div className="space-y-4 sm:space-y-6">
                          {/* Order Number */}
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                              Order Information
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                              <span className="font-medium">Order Number:</span>{" "}
                              {selectedOrder.orderNumber}
                            </p>
                          </div>

                          {/* Products */}
                          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                              Products ({selectedOrder.products?.length || 0})
                            </h3>
                            <div className="space-y-2">
                              {selectedOrder.products?.map((product, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-md border gap-2"
                                >
                                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                                    {product.productName}
                                  </span>
                                  <span className="text-gray-600 text-sm sm:text-base">
                                    ৳{product.price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                              Payment Details
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                              <div>
                                <p className="text-sm sm:text-base text-gray-600">
                                  <span className="font-medium">Method:</span>{" "}
                                  {selectedOrder.paymentMethod?.toUpperCase()}
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  <span className="font-medium">Total:</span> ৳
                                  {selectedOrder.totalPrice}
                                </p>
                              </div>

                              {/* Uddoktapay specific details */}
                              {selectedOrder.paymentMethod === "uddoktapay" &&
                                selectedOrder.uddoktaPay && (
                                  <div className="bg-white p-3 rounded-md border">
                                    <p className="text-xs sm:text-sm text-gray-800 font-medium">
                                      <span className="font-medium">
                                        Invoice ID:
                                      </span>{" "}
                                      {selectedOrder.uddoktaPay.invoiceId ||
                                        "N/A"}
                                    </p>
                                  </div>
                                )}

                              {/* Manual payment details */}
                              {selectedOrder.manualPaymentMethod && (
                                <div className="bg-white p-3 rounded-md border">
                                  <p className="text-xs sm:text-sm text-gray-800">
                                    <span className="font-medium">
                                      Sender Number:
                                    </span>{" "}
                                    {
                                      selectedOrder.manualPaymentMethod
                                        .senderNumber
                                    }
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-800">
                                    <span className="font-medium">
                                      Transaction ID:
                                    </span>{" "}
                                    {
                                      selectedOrder.manualPaymentMethod
                                        .senderTransactionId
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status and Cancel Reason */}
                          <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                              Order Status
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                  selectedOrder.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : selectedOrder.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : selectedOrder.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {selectedOrder.status === "cancelled"
                                  ? "Cancelled"
                                  : selectedOrder.status === "pending"
                                  ? "Pending"
                                  : selectedOrder.status === "delivered"
                                  ? "Delivered"
                                  : "Processing"}
                              </span>
                            </div>

                            {selectedOrder.status === "cancelled" && (
                              <div className="bg-white p-3 rounded-md border border-red-200">
                                <p className="text-xs sm:text-sm text-gray-600">
                                  <span className="font-medium text-red-700">
                                    Cancel Reason:
                                  </span>
                                  <span className="ml-2 text-red-600">
                                    {selectedOrder.cancelReason ||
                                      "No reason provided"}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
