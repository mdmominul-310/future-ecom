"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// --- Type Definition ---
interface IReview {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// --- START: Modernized Components ---

// Skeleton Loader for a cleaner loading experience
const ReviewSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="h-5 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="mt-4 h-4 bg-gray-200 rounded w-1/3"></div>
  </div>
);

// Redesigned Review Card
const ReviewCard = ({ review }: { review: IReview }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80"
  >
    <div className="flex items-center mb-3">
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
    <p className="text-gray-700 italic mb-4 leading-relaxed">
      “{review.comment}”
    </p>
    <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
      <p className="font-semibold text-gray-800">{review.name}</p>
      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  </motion.div>
);

// --- END: Modernized Components ---

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Could not load reviews.");
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
      toast.error("Please select a star rating.");
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
        toast.success("Thank you! Your review has been submitted.");
        setName("");
        setComment("");
        setRating(0);
        // Optimistically add the new review to the UI
        setReviews([data.data, ...reviews]);
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
    <div className="bg-[#F7F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900">
            Customer Feedback
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            See what others are saying and share your own experience with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* --- Review Submission Form Column --- */}
          <motion.div
            className="lg:col-span-1 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 sticky top-8">
              <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                Leave a Review
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Your Comment
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full border px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Rating
                  </label>
                  <div
                    className="flex items-center"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= (hoverRating || rating)
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
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 transition-transform transform hover:scale-105"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* --- All Reviews List Column --- */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <ReviewSkeleton key={i} />
                  ))
                : reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
