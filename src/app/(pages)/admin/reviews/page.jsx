"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRating from "@/components/ui/star-rating";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FaCheck, FaTrash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "@/components/Loading/Loading";
import Swal from "sweetalert2";

export default function AdminReviews() {
  const { data: session } = useSession();
  const [filterStatus, setFilterStatus] = useState("pending");
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["admin-reviews", filterStatus],
    queryFn: async () => {
      const res = await fetch(`/api/admin/reviews?status=${filterStatus}`);
      const data = await res.json();
      return data;
    },
    enabled: !!session,
  });

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00BEFA",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `/api/admin/reviews?reviewId=${reviewId}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (response.ok) {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
          } else {
            toast.error(data.message || "Failed to delete review");
          }
        } catch (error) {
          console.error("Error deleting review:", error);
          toast.error("Failed to delete review");
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mb-20 overflow-hidden ">
      <Card>
        <CardHeader className="">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
              Reviews Management
            </CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("pending")}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("approved")}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Accepted
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="">
          {reviewsData?.reviews?.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SL</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewsData.reviews.map((review, index) => (
                      <TableRow key={review._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {review.userName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {review.userEmail}
                        </TableCell>
                        <TableCell>
                          <StarRating rating={review.rating} readonly={true} />
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={review.review}>
                            {review.review}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {review.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(review._id, "approved")
                                }
                                className="text-green-600 hover:text-green-700"
                              >
                                <FaCheck className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FaTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {reviewsData.reviews.map((review, index) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    index={index}
                    getStatusBadge={getStatusBadge}
                    onApprove={() => handleStatusUpdate(review._id, "approved")}
                    onDelete={() => handleDeleteReview(review._id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500 text-lg sm:text-xl">
                No reviews found
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ReviewCard component for mobile view
const ReviewCard = ({ review, index, getStatusBadge, onApprove, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            #{index + 1} • {review.userName}
          </h4>
          <p className="text-xs text-gray-600 mt-1 break-words">
            {review.userEmail}
          </p>
        </div>
        {getStatusBadge(review.status)}
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Rating:</span>
          <div className="mt-1">
            <StarRating rating={review.rating} readonly={true} />
          </div>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Review:</span>
          <p className="text-xs text-gray-600 mt-1 line-clamp-3">
            {review.review}
          </p>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Date:</span>
          <span className="text-xs text-gray-600 ml-1">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {review.status === "pending" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onApprove}
            className="flex-1 text-green-600 hover:text-green-700"
          >
            <FaCheck className="h-4 w-4 mr-1" />
            <span className="text-xs sm:text-sm">Approve</span>
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-red-600 hover:text-red-700"
        >
          <FaTrash className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Delete</span>
        </Button>
      </div>
    </div>
  );
};
