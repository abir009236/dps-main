"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/ui/star-rating";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";

const ReviewDialog = ({ order, onReviewSubmit }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: session?.user?.name,
          userEmail: session?.user?.email,
          orderId: order._id,
          rating,
          review: review.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setOpen(false);
        setRating(0);
        setReview("");
        if (onReviewSubmit) {
          onReviewSubmit();
        }
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-xl overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Product Information */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
              Product Information
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {order.products?.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 sm:gap-4 bg-white p-2 sm:p-3 rounded-md border"
                >
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                    <Image
                      src={product.productImage}
                      alt={product.productName}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                      {product.productName}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Price: ৳{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-2">
            <Label
              htmlFor="rating"
              className="text-sm sm:text-base font-medium"
            >
              Rating *
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                readonly={false}
              />
              <span className="text-xs sm:text-sm text-gray-600">
                {rating > 0 && `${rating} out of 5 stars`}
              </span>
            </div>
          </div>

          {/* Review Message */}
          <div className="space-y-2">
            <Label
              htmlFor="review"
              className="text-sm sm:text-base font-medium"
            >
              Your Review *
            </Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
              maxLength={500}
            />
            <p className="text-xs sm:text-sm text-gray-500 text-right">
              {review.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || rating === 0 || !review.trim()}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
