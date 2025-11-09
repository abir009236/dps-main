"use client";
import TitlePage from "@/components/TitlePage/TitlePage";
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "@/components/ui/star-rating";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";

export default function Reviews() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  // Fetch approved reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/users/reviews");
      const data = await res.json();
      return data;
    },
  });

  // Auto-play functionality
  useEffect(() => {
    if (!api || !reviewsData?.review?.length) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Reset to first slide
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api, reviewsData]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) return <Loading />;

  const reviews = reviewsData?.review || [];

  return (
    <div className="py-10 px-4">
      <TitlePage
        title="What Our Customers Say"
        description="Hear real stories and feedback from customers who trust and rely on our services for their everyday needs."
        buttonText="See Reviews"
      />
      
      {reviews.length > 0 ? (
        <div className="mt-12 max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem key={review._id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[200px]">
                        {/* User Name */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {review.userName}
                        </h3>
                        
                        {/* Star Rating */}
                        <div className="mb-4">
                          <StarRating
                            rating={review.rating}
                            readonly={true}
                          />
                        </div>
                        
                        {/* Review Text */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                          "{review.review}"
                        </p>
                        
                        {/* Review Date */}
                        <p className="text-xs text-gray-400 mt-4">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          
          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === current ? "bg-primary" : "bg-gray-300"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-lg">No reviews available yet.</p>
        </div>
      )}
    </div>
  );
}
