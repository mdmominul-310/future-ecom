"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  currentCategory: string;
  searchParams: {
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    keyFeatures?: string[];
    shortDescription?: string;
  };
}

export function ProductFilters({ currentCategory, searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsObj.toString());
    
    // Update or remove params
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    params.set("page", "1");
    
    router.push(`/products/${currentCategory}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => router.push('/products/all')}
            className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
              currentCategory === 'all' ? 'bg-gray-100' : ''
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => router.push(`/products/${category.slug}`)}
              className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                currentCategory === category.slug ? 'bg-gray-100' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-lg font-medium mb-4">Sort By</h3>
        <RadioGroup
          value={searchParams.sort || "createdAt"}
          onValueChange={(value) => updateFilters({ sort: value })}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createdAt" id="newest" />
            <Label htmlFor="newest">Newest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price" id="price-low-high" />
            <Label htmlFor="price-low-high">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="-price" id="price-high-low" />
            <Label htmlFor="price-high-low">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="-rating" id="rating" />
            <Label htmlFor="rating">Rating</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[
              parseInt(searchParams.minPrice || "0"),
              parseInt(searchParams.maxPrice || "1000"),
            ]}
            max={1000}
            step={10}
            onValueChange={([min, max]) => {
              updateFilters({
                minPrice: min.toString(),
                maxPrice: max.toString(),
              });
            }}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${searchParams.minPrice || "0"}</span>
            <span>${searchParams.maxPrice || "1000"}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-lg font-medium mb-4">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilters({ rating: rating.toString() })}
              className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100 ${
                searchParams.rating === rating.toString() ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-500">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          router.push(`/products/${currentCategory}`);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
} 