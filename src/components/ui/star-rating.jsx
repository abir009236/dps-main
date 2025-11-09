"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <Star
            key={star}
            className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors ${
              isFilled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            } ${readonly ? "cursor-default" : ""}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
