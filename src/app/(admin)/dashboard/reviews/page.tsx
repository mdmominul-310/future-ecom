"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Star, Edit, Trash2, X, Filter } from "lucide-react";
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

// --- Main Page Component ---
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals and selected review
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // State for filtering
  const [filterRating, setFilterRating] = useState<number>(0); // 0 means all

  // Fetch all reviews on component mount
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch reviews.");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Apply filter when reviews or filterRating changes
  useEffect(() => {
    if (filterRating === 0) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter((review) => review.rating === filterRating)
      );
    }
  }, [reviews, filterRating]);

  // --- Handlers for Modals ---
  const handleOpenUpdateModal = (review: IReview) => {
    setSelectedReview(review);
    setUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (review: IReview) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setUpdateModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedReview(null);
  };

  // --- API Handlers ---
  const handleUpdateReview = async (updatedData: {
    name: string;
    comment: string;
    rating: number;
  }) => {
    if (!selectedReview) return;
    try {
      const res = await fetch(`/api/reviews/${selectedReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review updated successfully!");
        fetchReviews(); // Re-fetch to get updated list
        handleCloseModals();
      } else {
        throw new Error(data.error || "Failed to update review.");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    try {
      const res = await fetch(`/api/reviews/${selectedReview._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews(); // Re-fetch to get updated list
        handleCloseModals();
      } else {
        throw new Error(data.error || "Failed to delete review.");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Reviews</h1>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <span className="font-semibold">Filter by Rating:</span>
        {[0, 1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              filterRating === rating
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {rating === 0 ? "All" : `${rating} Star`}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading reviews...</p>
        ) : error ? (
          <p className="p-6 text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{review.name}</td>
                    <td className="p-4 text-gray-600 max-w-sm truncate">
                      {review.comment}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenUpdateModal(review)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        aria-label="Edit review"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(review)}
                        className="p-2 text-red-600 hover:text-red-800"
                        aria-label="Delete review"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No reviews found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isUpdateModalOpen && selectedReview && (
          <UpdateReviewModal
            review={selectedReview}
            onClose={handleCloseModals}
            onUpdate={handleUpdateReview}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            onClose={handleCloseModals}
            onConfirm={handleDeleteReview}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Update Review Modal Component ---
const UpdateReviewModal = ({
  review,
  onClose,
  onUpdate,
}: {
  review: IReview;
  onClose: () => void;
  onUpdate: (data: any) => void;
}) => {
  const [name, setName] = useState(review.name);
  const [comment, setComment] = useState(review.comment);
  const [rating, setRating] = useState(review.rating);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate({ name, comment, rating });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Review</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-7 h-7 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Delete Confirmation Modal Component ---
const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this review? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
