"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface IReview {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

const ReviewCard = ({ review }: { review: IReview }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < review.rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
    <p className="text-gray-700 italic mb-4">&quot;{review.comment}&quot;</p>
    <div className="flex justify-between items-center text-sm text-gray-500">
      <p className="font-semibold">- {review.name}</p>
      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  </motion.div>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Thank you for your review!");
        setName("");
        setComment("");
        setRating(0);
        fetchReviews(); // Refresh reviews list
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-600 mt-2">
            See what others are saying about their experience.
          </p>
        </motion.div>

        {/* Review Submission Form */}
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Leave a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-600"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Rating
              </label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
              <Send className="ml-2 h-5 w-5" />
            </button>
          </form>
        </motion.div>

        {/* All Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center">Loading reviews...</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
