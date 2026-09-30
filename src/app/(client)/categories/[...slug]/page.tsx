"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/client/ProductCard";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterSidebar } from "@/components/client/FilterSidebar";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  PackageOpen,
  X,
  Layers,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { trackViewItemList } from "@/lib/tracking";

// --- INTERFACES ---
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  status: string;
  featured: boolean;
  rating: number;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: { url: string; alt: string };
  slug: string;
  subcategories?: { _id: string; name: string; slug: string }[];
}

// --- SKELETON COMPONENTS ---
function ProductCardSkeleton() {
  return (
    <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function CategoryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-44 rounded-3xl bg-slate-100 dark:bg-slate-800/60 p-6 mb-8 flex flex-col justify-center space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-full md:w-64 shrink-0 space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-40 rounded-xl" />
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const slugArray = (params?.slug as string[]) || [];
  const categorySlug = slugArray[0] ? decodeURIComponent(slugArray[0]) : "all";
  const subcategorySlug = slugArray[1] ? decodeURIComponent(slugArray[1]) : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOrder, setSortOrder] = useState("createdAt:desc");

  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const limit = 12;
  const search = useSelector((state: any) => state.search.query);

  // Unified Tracking: view_item_list (GTM, Meta Pixel, GA4)
  useEffect(() => {
    if (!loading && products.length > 0) {
      const categoryName =
        categories.find((cat) => cat.slug === categorySlug)?.name ||
        "All Products";
      trackViewItemList(categoryName, products);
    }
  }, [loading, products, categories, categorySlug]);

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (sort && order) {
      setSortOrder(`${sort}:${order}`);
    }
  }, [searchParams]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search, minPrice, maxPrice, sortOrder]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `/api/products?page=${currentPage}&limit=${limit}`;

        if (selectedCategory !== "all") {
          const category = categories.find(
            (cat) => cat.slug === selectedCategory,
          );
          if (category) {
            url += `&category=${category._id}`;
            if (subcategorySlug) {
              const subcategory = category.subcategories?.find(
                (sub) => sub.slug === subcategorySlug,
              );
              if (subcategory) url += `&subcategory=${subcategory._id}`;
            }
          }
        }
        if (sortOrder) {
          const [sort, order] = sortOrder.split(":");
          url += `&sort=${sort}&order=${order}`;
        }
        if (search) url += `&search=${encodeURIComponent(search.trim())}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice && maxPrice < 100000) url += `&maxPrice=${maxPrice}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        if (data.pagination?.total !== undefined) {
          setTotalProducts(data.pagination.total);
        } else {
          setTotalProducts(data.products?.length || 0);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 || selectedCategory === "all") {
      fetchProducts();
    }
  }, [
    categories,
    subcategorySlug,
    currentPage,
    sortOrder,
    search,
    selectedCategory,
    minPrice,
    maxPrice,
  ]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    router.push(`/categories/${slug}`);
  };

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setMinPrice(0);
    setMaxPrice(100000);
    router.push("/categories/all");
  };

  const currentCategory = categories.find((c) => c.slug === selectedCategory);
  const activeSubcategory = currentCategory?.subcategories?.find(
    (s) => s.slug === subcategorySlug,
  );

  const hasActiveFilters =
    selectedCategory !== "all" ||
    minPrice > 0 ||
    maxPrice < 100000 ||
    Boolean(search);

  // Modern Pagination generator
  const generatePaginationLinks = () => {
    const links = [];

    // Previous Button
    links.push(
      <button
        key="prev"
        className={`inline-flex items-center gap-1 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all ${
          currentPage === 1
            ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600 shadow-xs"
        }`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>,
    );

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
      links.push(
        <button
          key="1"
          className="w-9 h-9 flex items-center justify-center border rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs transition-all"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        links.push(
          <span key="ellipsis1" className="px-2 text-slate-400 font-bold">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage;
      links.push(
        <button
          key={i}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-xs ${
            isActive
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-105"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(
          <span key="ellipsis2" className="px-2 text-slate-400 font-bold">
            ...
          </span>,
        );
      }
      links.push(
        <button
          key={totalPages}
          className="w-9 h-9 flex items-center justify-center border rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs transition-all"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>,
      );
    }

    // Next Button
    links.push(
      <button
        key="next"
        className={`inline-flex items-center gap-1 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all ${
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600 shadow-xs"
        }`}
        onClick={() =>
          currentPage < totalPages && handlePageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>,
    );

    return links;
  };

  if (loading && categories.length === 0) {
    return <CategoryPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center py-12 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-950/60 shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Unable to Load Catalog
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all text-xs"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* TOP HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-100 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-slate-900 border border-orange-200/60 dark:border-orange-900/40 p-6 sm:p-8 mb-8 shadow-xs">
          {/* Subtle Ambient Glow Circles */}
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 relative z-10 flex-wrap">
            <Link
              href="/"
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/categories/all"
              className={`hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
                selectedCategory === "all"
                  ? "font-semibold text-orange-600 dark:text-orange-400"
                  : ""
              }`}
            >
              Catalog
            </Link>
            {selectedCategory !== "all" && currentCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentCategory.name}
                </span>
              </>
            )}
            {activeSubcategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {activeSubcategory.name}
                </span>
              </>
            )}
          </nav>

          {/* Main Title & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedCategory === "all"
                    ? "All Products Collection"
                    : activeSubcategory
                      ? activeSubcategory.name
                      : currentCategory?.name || "Products"}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                  <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                  {totalProducts} Items Available
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {currentCategory?.description ||
                  "Discover authentic quality essentials, genuine electronics, automotive supplies, and daily lifestyle must-haves with nationwide warranty & fast delivery."}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-24">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
          </aside>

          {/* PRODUCTS CATALOG CONTENT AREA */}
          <main className="flex-1 w-full">
            {/* TOOLBAR CONTROLS BAR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left Side: Mobile Filter Button & Active Filter Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile Filter Drawer Trigger */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                        <span>Filter</span>
                        {hasActiveFilters && (
                          <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                        )}
                      </button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[85%] sm:w-[350px] p-6 flex flex-col bg-white dark:bg-slate-900"
                    >
                      <SheetHeader className="mb-4">
                        <SheetTitle className="text-lg font-bold flex items-center gap-2">
                          <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                          Filter Products
                        </SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto pr-1">
                        <FilterSidebar
                          categories={categories}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          minPrice={minPrice}
                          setMinPrice={setMinPrice}
                          maxPrice={maxPrice}
                          setMaxPrice={setMaxPrice}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Showing results count */}
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Showing{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {totalProducts}
                  </span>{" "}
                  products
                </p>

                {/* Active Filter Chips */}
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                    {currentCategory?.name || selectedCategory}
                    <button
                      onClick={() => handleCategorySelect("all")}
                      className="hover:text-orange-900 dark:hover:text-white"
                      title="Clear category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(minPrice > 0 || maxPrice < 100000) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                    ৳{minPrice} - ৳{maxPrice}
                    <button
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(100000);
                      }}
                      className="hover:text-orange-900 dark:hover:text-white"
                      title="Clear price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 font-medium underline underline-offset-2 ml-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Right Side: Sort dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  Sort:
                </span>
                <select
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-all"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <option value="createdAt:desc">✨ Newest Arrivals</option>
                  <option value="price:asc">💵 Price: Low to High</option>
                  <option value="price:desc">💎 Price: High to Low</option>
                  <option value="name:asc">🔤 Name: A to Z</option>
                  <option value="name:desc">🔤 Name: Z to A</option>
                  <option value="rating:desc">⭐ Top Customer Rated</option>
                  <option value="soldCount:desc">🔥 Best Selling</option>
                </select>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={{ ...product, id: product._id } as any}
                    />
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Page{" "}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {totalPages}
                      </span>{" "}
                      ({totalProducts} total products)
                    </p>
                    <nav className="flex items-center gap-1.5 flex-wrap justify-center">
                      {generatePaginationLinks()}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              /* EMPTY STATE */
              <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
                  <PackageOpen className="w-10 h-10" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any items matching your selected
                  criteria. Try clearing some filters or exploring another
                  category.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </button>
                  <Link
                    href="/categories/all"
                    onClick={() => setSelectedCategory("all")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Browse All Products
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
