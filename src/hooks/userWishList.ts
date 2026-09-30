"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ProductData } from "@/types/products"; // Ensure ProductData is correctly imported

// Define the localStorage key for consistency
const LOCAL_STORAGE_KEY = "wishlistItems";

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<ProductData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
        const initialWishlist: ProductData[] = storedWishlist
          ? JSON.parse(storedWishlist)
          : [];
        setWishlistItems(initialWishlist);
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error);
        setWishlistItems([]);
        toast.error("Could not load wishlist. Some data might be corrupted.");
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Sync wishlist to localStorage whenever wishlistItems changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
      } catch (error) {
        console.error("Failed to save wishlist to localStorage:", error);
        toast.error("Could not save wishlist changes.");
      }
    }
  }, [wishlistItems, isInitialized]);

  const addProductToWishlist = useCallback((product: ProductData) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item._id === product._id);
      if (!exists) {
        toast.success(`"${product.name}" added to wishlist!`);
        return [...prevItems, product];
      }
      return prevItems; // Product already exists
    });
  }, []);

  const removeProductFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item._id !== productId);
      if (prevItems.length !== updatedItems.length) {
        // Only show toast if an item was actually removed
        toast.info("Product removed from wishlist.");
      }
      return updatedItems;
    });
  }, []);

  const isProductInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.some((item) => item._id === productId);
    },
    [wishlistItems]
  );

  const toggleWishlist = useCallback(
    (product: ProductData) => {
      // FIX: Add a guard clause to ensure product._id is not undefined.
      if (!product?._id) {
        console.error("Attempted to toggle wishlist for a product with no ID.");
        return;
      }

      if (isProductInWishlist(product._id)) {
        removeProductFromWishlist(product._id);
      } else {
        addProductToWishlist(product);
      }
    },
    [addProductToWishlist, isProductInWishlist, removeProductFromWishlist]
  );

  return {
    wishlistItems,
    addProductToWishlist,
    removeProductFromWishlist,
    isProductInWishlist,
    toggleWishlist,
    loading: !isInitialized, // Indicate if the initial load is complete
  };
}
