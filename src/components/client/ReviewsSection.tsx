"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface IReview {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// --- 1. Define Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animates children 0.2s after each other
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ReviewCard = ({ review }: { review: IReview }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
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
      <p className="text-gray-600 italic mb-4 flex-grow">
        &quot;{review.comment}&quot;
      </p>
      <p className="font-semibold text-gray-800">- {review.name}</p>
    </div>
  );
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.data.slice(0, 3)); // Show latest 3 reviews
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (reviews.length === 0) return null;

  return (
    <section className="bg-[#F7F5EF] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-amber-900">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 mt-2">
            Real reviews from our valued customers.
          </p>
        </div>
        {/* --- 2. Apply Animation to the Grid Container --- */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {reviews.map((review) => (
            // --- 3. Apply Animation to Each Card ---
            <motion.div key={review._id} variants={itemVariants}>
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-10">
          <Link href="/reviews">
            <span className="inline-flex items-center px-6 py-2 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-orange-500 hover:bg-orange-600 transition">
              View All Reviews
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
