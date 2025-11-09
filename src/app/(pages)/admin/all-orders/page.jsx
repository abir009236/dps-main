"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Truck, X, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaUndo } from "react-icons/fa";
import Swal from "sweetalert2";

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deliverDialogOpen, setDeliverDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders`);
      const data = await response.json();
      if (data.success) {
        setAllOrders(data.orders);
        setFilteredOrders(data.orders);
        return data?.orders;
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "all") {
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter((order) => order.status === newFilter);
      setFilteredOrders(filtered);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "initiated":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "bkash":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "rocket":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "nagad":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "uddoktapay":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "refund-balance":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDeliver = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "delivered",
          deliveryDetails,
        }),
      });

      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setDeliverDialogOpen(false);
        setDeliveryDetails("");
        refetch();
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      toast.error("Error delivering order");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          cancelReason,
        }),
      });

      const data = await response.json();
      if (data?.success) {
        toast.success(data?.message);
        setCancelDialogOpen(false);
        refetch();
        setCancelReason("");
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleRefund = async () => {
    try {
      Swal.fire({
        title: "Are you sure to refund?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, refund it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(
            `/api/admin/orders/${selectedOrder._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "refunded",
              }),
            }
          );
          const data = await response.json();
          if (data?.message) {
            toast.success("Order refunded successfully");
            refetch();
            setSelectedOrder(null);
          } else {
            toast.error("Failed to refund order");
          }
        }
      });
    } catch (error) {
      toast.error(error?.message);
    }
  };
  return (
    <div className="mb-20 overflow-hidden ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          All Orders
        </h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => handleFilterChange("all")}
            className={`text-xs sm:text-sm cursor-pointer flex-1 sm:flex-none ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-500"
            }`}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => handleFilterChange("pending")}
            className={`text-xs sm:text-sm cursor-pointer flex-1 sm:flex-none ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-500"
            }`}
          >
            Pending
          </Button>
          <Button
            variant={filter === "delivered" ? "default" : "outline"}
            onClick={() => handleFilterChange("delivered")}
            className={`text-xs sm:text-sm cursor-pointer flex-1 sm:flex-none ${
              filter === "delivered"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-500"
            }`}
          >
            Delivered
          </Button>
          <Button
            variant={filter === "cancelled" ? "default" : "outline"}
            onClick={() => handleFilterChange("cancelled")}
            className={`text-xs sm:text-sm cursor-pointer flex-1 sm:flex-none ${
              filter === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-500"
            }`}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SL</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.products.map((product, idx) => (
                              <div key={idx} className="text-sm">
                                {product.productName} (x{product.quantity})
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.totalPrice} BDT
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPaymentMethodColor(
                              order.paymentMethod
                            )}
                          >
                            {order.paymentMethod.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setViewDialogOpen(true);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Order</TooltipContent>
                            </Tooltip>

                            {order.status === "pending" && (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setDeliverDialogOpen(true);
                                      }}
                                      className="text-green-600 hover:text-green-700 cursor-pointer"
                                    >
                                      <Truck className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    Deliver Order
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        handleRefund();
                                      }}
                                      className="text-red-600 hover:text-red-700 cursor-pointer"
                                    >
                                      <FaUndo className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    Refund Order
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setCancelDialogOpen(true);
                                      }}
                                      className="text-red-600 hover:text-red-700 cursor-pointer"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    Cancel Order
                                  </TooltipContent>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredOrders.map((order, index) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    index={index}
                    getStatusColor={getStatusColor}
                    getPaymentMethodColor={getPaymentMethodColor}
                    onViewOrder={() => {
                      setSelectedOrder(order);
                      setViewDialogOpen(true);
                    }}
                    onDeliverOrder={() => {
                      setSelectedOrder(order);
                      setDeliverDialogOpen(true);
                    }}
                    onRefundOrder={() => {
                      setSelectedOrder(order);
                      handleRefund();
                    }}
                    onCancelOrder={() => {
                      setSelectedOrder(order);
                      setCancelDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-red-500 font-semibold text-lg sm:text-xl">
                No orders found
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog
        open={viewDialogOpen}
        onOpenChange={(v) => {
          setViewDialogOpen(v);
          if (!v) {
            setSelectedOrder(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary text-lg sm:text-xl">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <div className="text-sm text-gray-600">
                    {selectedOrder.user?.name} ({selectedOrder.user?.email})
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Number</Label>
                  <div className="text-sm text-red-500 font-bold">
                    {selectedOrder.orderNumber}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Products</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <p className="text-sm font-bold">{idx + 1}.</p>
                      <div className="flex items-center gap-4 p-3 border rounded-lg w-full">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-24 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {product.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Quantity: {product.quantity} | Price:{" "}
                            {product.price} BDT
                          </div>
                          <div>
                            {product.extraFields && (
                              <div>
                                <div className="space-y-1 mt-2">
                                  {Object.entries(product.extraFields).map(
                                    ([key, value]) => (
                                      <div key={key}>{value}</div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Price</Label>
                  <div className="text-lg font-semibold text-green-600">
                    {selectedOrder.totalPrice} BDT
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <Badge
                    className={getPaymentMethodColor(
                      selectedOrder.paymentMethod
                    )}
                  >
                    {selectedOrder.paymentMethod.toUpperCase()}
                  </Badge>
                </div>
                {selectedOrder.paymentMethod === "uddoktapay" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Payment Status
                    </Label>
                    <Badge
                      className={getStatusColor(
                        selectedOrder?.uddoktaPay?.status
                      )}
                    >
                      {selectedOrder?.uddoktaPay?.status === "success"
                        ? "Success"
                        : selectedOrder?.uddoktaPay?.status === "pending"
                        ? "Pending"
                        : selectedOrder?.uddoktaPay?.status === "initiated"
                        ? "Failed"
                        : ""}
                    </Badge>
                  </div>
                )}
              </div>

              {selectedOrder.paymentMethod === "uddoktapay" ? (
                <div>
                  <Label className="font-medium">UddoktaPay Details</Label>
                  <div className="space-y-2 mt-2">
                    <div className="text-sm font-bold">
                      <span className="font-medium">Invoice ID:</span>{" "}
                      {selectedOrder.uddoktaPay?.invoiceId}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="font-medium">Payment Details -</Label>
                  <div className=" mt-2 flex items-center gap-5 mb-3">
                    <div className="">
                      <span className="font-medium">Sender Number :</span>{" "}
                      <span className="font-bold ">
                        {" "}
                        {selectedOrder.manualPaymentMethod?.senderNumber}
                      </span>
                    </div>
                    <div className="">
                      <span className="font-medium">Transaction ID :</span>{" "}
                      <span className="font-bold ">
                        {" "}
                        {selectedOrder.manualPaymentMethod?.senderTransactionId}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.status === "cancelled" && (
                <div>
                  <div className="  text-center font-semibold text-red-500 ">
                    * {selectedOrder.cancelReason}
                  </div>
                </div>
              )}

              {selectedOrder.status === "delivered" && (
                <div>
                  <div className="  text-center font-semibold text-green-500 ">
                    * {selectedOrder.deliverdDetails}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Deliver Order Dialog */}
      <Dialog
        open={deliverDialogOpen}
        onOpenChange={(v) => {
          setDeliverDialogOpen(v);
          if (!v) {
            setSelectedOrder(null);
            setDeliveryDetails("");
          }
        }}
      >
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary text-lg sm:text-xl">
              Deliver Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="deliveryDetails"
                className="text-sm font-medium mb-1"
              >
                Delivery Details
              </Label>
              <Textarea
                id="deliveryDetails"
                placeholder="Enter delivery details (email, password, text, etc.)"
                value={deliveryDetails}
                onChange={(e) => setDeliveryDetails(e.target.value)}
                rows={4}
                className="w-full resize-none min-w-0"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              />
              <p className="text-sm text-gray-500 mt-1">
                You can leave this empty if not required for the product.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeliverDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base">Cancel</span>
              </Button>
              <Button
                onClick={handleDeliver}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base">Deliver Order</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onOpenChange={(v) => {
          setCancelDialogOpen(v);
          if (!v) {
            setSelectedOrder(null);
            setCancelReason("");
          }
        }}
      >
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary text-lg sm:text-xl">
              Cancel Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="cancelReason"
                className="text-sm font-medium mb-1"
              >
                Cancel Reason
              </Label>
              <Textarea
                id="cancelReason"
                placeholder="Enter reason for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                required
                className="w-full resize-none min-w-0"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base">Cancel</span>
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                disabled={!cancelReason.trim()}
              >
                <span className="text-sm sm:text-base">Cancel Order</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// OrderCard component for mobile view
const OrderCard = ({
  order,
  index,
  getStatusColor,
  getPaymentMethodColor,
  onViewOrder,
  onDeliverOrder,
  onRefundOrder,
  onCancelOrder,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            Order #{order.orderNumber || index + 1}
          </h4>
          <p className="text-xs text-gray-600 mt-1 break-words">
            {order.user?.name} • {order.user?.email}
          </p>
        </div>
        <Badge className={`${getStatusColor(order.status)} text-xs sm:text-sm`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Products:</span>
          <div className="mt-1 space-y-1">
            {order.products.slice(0, 2).map((product, idx) => (
              <div key={idx} className="text-xs break-words">
                • {product.productName} (x{product.quantity})
              </div>
            ))}
            {order.products.length > 2 && (
              <div className="text-xs text-gray-500">
                +{order.products.length - 2} more items
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            ৳{order.totalPrice} BDT
          </span>
          <Badge
            className={`text-xs ${getPaymentMethodColor(
              order.paymentMethod
            )} mt-1`}
          >
            {order.paymentMethod.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewOrder}
          className="w-full sm:flex-1 text-blue-600 hover:text-blue-700"
        >
          <Eye className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">View</span>
        </Button>

        {order.status === "pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeliverOrder}
              className="w-full sm:flex-1 text-green-600 hover:text-green-700"
            >
              <Truck className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">Deliver</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefundOrder}
              className="w-full sm:flex-1 text-red-600 hover:text-red-700"
            >
              <FaUndo className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">Refund</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelOrder}
              className="w-full sm:flex-1 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">Cancel</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
