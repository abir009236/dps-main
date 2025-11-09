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
import ReviewDialog from "@/components/ReviewDialog/ReviewDialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { memo, useMemo, useState } from "react";
import { FaCartPlus, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Orders() {
  const { data: session } = useSession();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["delivered_orders", session?._id],
    queryFn: async () => {
      const res = await fetch(`/api/users/delivered?userId=${session?._id}`, {
        cache: "no-store",
      });
      const json = await res.json();
      return json || [];
    },
    enabled: !!session?._id,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    select: (data) => (Array.isArray(data) ? data : []),
    placeholderData: (prev) => prev ?? [],
  });

  const handleReviewSubmit = () => {
    refetch(); // Refresh the orders data after review submission
  };
  if (isLoading) return <Loading />;

  return (
    <div className="px-2 sm:px-4 md:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
          Delivered Products
        </h2>
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-black font-medium">
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <OrderRow
                  key={order._id || index}
                  index={index}
                  order={order}
                  onSelect={() => setSelectedOrder(order)}
                  onReviewSubmit={handleReviewSubmit}
                  selectedOrder={selectedOrder}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Delivered
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
                  <span className="text-xs text-gray-600">
                    {order.paymentMethod?.toUpperCase() || "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaEye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
                          Delivered Summary
                        </DialogTitle>
                      </DialogHeader>

                      {selectedOrder && (
                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                              Order Information
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                              <span className="font-medium">Order Number:</span>{" "}
                              {selectedOrder.orderNumber}
                            </p>
                          </div>

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

                          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                              Delivered Status
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                                Delivered
                              </span>
                            </div>

                            {selectedOrder.status === "delivered" && (
                              <div className="bg-white p-3 rounded-md border border-green-200">
                                <p className="text-xs sm:text-sm text-gray-600">
                                  <span className="font-medium text-green-700">
                                    Delivered Details:
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-gray-600 mt-1">
                                  <span className="font-medium text-green-700">
                                    {selectedOrder.deliverdDetails ||
                                      "No details provided"}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {order?.reviews === false && (
                    <ReviewDialog
                      order={order}
                      onReviewSubmit={handleReviewSubmit}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No delivered products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const OrderRow = memo(function OrderRow({
  order,
  index,
  onSelect,
  onReviewSubmit,
  selectedOrder,
}) {
  const productNames = useMemo(
    () => order.products?.map((p) => p.productName).join(", ") || "",
    [order.products]
  );
  const totalItems = order.products?.length || 0;
  const payment = (order.paymentMethod || "").toUpperCase();
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <div className="text-sm">{productNames}</div>
      </TableCell>
      <TableCell>{order.orderNumber || "N/A"}</TableCell>
      <TableCell>{totalItems}</TableCell>
      <TableCell>৳ {order.totalPrice || 0}</TableCell>
      <TableCell>{payment || "N/A"}</TableCell>
      <TableCell className="cursor-pointer font-bold">
        {order.status == "delivered" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelect}
                className="text-green-500 hover:text-green-700 cursor-pointer"
              >
                <FaEye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
                  Delivered Summary
                </DialogTitle>
              </DialogHeader>

              {selectedOrder && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                      Order Information
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      <span className="font-medium">Order Number:</span>{" "}
                      {selectedOrder.orderNumber}
                    </p>
                  </div>

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

                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                      Delivered Status
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </div>

                    {selectedOrder.status === "delivered" && (
                      <div className="bg-white p-3 rounded-md border border-green-200">
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium text-green-700">
                            Delivered Details:
                          </span>
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gray-600 mt-1">
                          <span className="font-medium text-green-700">
                            {selectedOrder.deliverdDetails ||
                              "No details provided"}
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
        {order?.reviews == false && (
          <ReviewDialog order={order} onReviewSubmit={onReviewSubmit} />
        )}
      </TableCell>
    </TableRow>
  );
});
