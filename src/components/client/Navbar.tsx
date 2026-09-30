"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/common/BrandLogo";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, Heart, X, ChevronDown, Sparkles, Phone, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/redux/slices/searchSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/redux/store";

export function Navbar() {
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [settings, setSettings] = useState<any>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const searchQuery = useSelector((state: RootState) => state.search.query);
  const totalQty = useSelector((state: RootState) => state.cart.totalQty);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/categories/all?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/categories/all`);
    }
    setIsSearchVisible(false);
  };

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const [catRes, setRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/settings"),
        ]);
        if (catRes.ok) setCategories(await catRes.json());
        if (setRes.ok) {
          const setData = await setRes.json();
          if (setData.success) setSettings(setData.data);
        }
      } catch (err) {
        console.error("Error fetching navbar data:", err);
      }
    };
    fetchNavbarData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", slug: "/" },
    { name: "Shop", slug: "/categories", hasDropdown: true },
    { name: "Blogs", slug: "/blogs" },
    { name: "About", slug: "/about" },
    { name: "Contact", slug: "/contact" },
  ];

  const isLinkActive = (linkSlug: string): boolean => {
    if (linkSlug === "/categories") return pathname.startsWith("/categories");
    return pathname === linkSlug;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      
      {/* Top Announcement Bar */}
      {(settings?.showAnnouncementBar ?? true) && (
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white text-[11px] sm:text-xs py-2 px-4 border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> FLASH SALE
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-stone-200">
                <Truck className="w-3.5 h-3.5 text-orange-400" />{" "}
                {settings?.announcementBarText ||
                  `Free Express Shipping on orders over ৳${(
                    settings?.freeShippingThreshold || 2000
                  ).toLocaleString()}!`}
              </span>
            </div>
            <div className="flex items-center gap-4 text-stone-300 font-medium">
              <a
                href={`tel:${settings?.supportPhone || "+880 1974-003819"}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <Phone className="w-3 h-3 text-emerald-400" /> Helpline:{" "}
                {settings?.supportPhone || "+880 1974-003819"}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Navigation Bar */}
      <div
        className={`w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-gray-800 transition-all duration-300 ${
          scrolled ? "shadow-lg py-1" : "py-2"
        }`}
      >
        <div className="container mx-auto px-4">
          
          {/* DESKTOP NAVBAR */}
          <div className="hidden md:flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <BrandLogo
                  logoUrl={settings?.logo}
                  siteTitle={settings?.siteTitle || "Future com"}
                  size="md"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Navigation Links with Category Dropdown */}
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => link.hasDropdown && setIsCategoryHovered(true)}
                  onMouseLeave={() => link.hasDropdown && setIsCategoryHovered(false)}
                >
                  <Link
                    href={link.slug === "/categories" ? "/categories/all" : link.slug}
                    className={`inline-flex items-center gap-1 text-sm font-bold transition-all relative ${
                      isLinkActive(link.slug)
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-stone-700 dark:text-stone-200 hover:text-orange-600 dark:hover:text-orange-400"
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-stone-500" />
                    )}
                    {isLinkActive(link.slug) && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-600 rounded-full"></span>
                    )}
                  </Link>

                  {/* Categories Dropdown Menu */}
                  {link.hasDropdown && isCategoryHovered && categories.length > 0 && (
                    <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-stone-200/80 dark:border-gray-800 p-3 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 px-3 mb-2">
                        Product Categories
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/categories/all"
                          className="block px-3 py-2 rounded-xl text-sm font-bold text-stone-800 dark:text-stone-100 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 transition-colors"
                        >
                          🔥 All Products
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/categories/${cat.slug}`}
                            className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Action Icons & Search */}
            <div className="flex items-center space-x-3">
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-3.5 text-stone-400 w-4 h-4" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-52 lg:w-64 pl-9 pr-4 py-2 bg-stone-100/80 dark:bg-gray-800/80 border border-stone-200/80 dark:border-gray-700 text-stone-900 dark:text-white text-xs sm:text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
                  aria-label="Search"
                />
              </form>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="p-2.5 rounded-full text-stone-700 dark:text-stone-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 transition-all duration-200 relative"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Shopping Cart Icon with Pulsing Badge */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="p-2.5 relative rounded-full text-stone-700 dark:text-stone-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalQty > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-md animate-pulse">
                    {totalQty}
                  </span>
                )}
              </Link>

              {/* Account Button */}
              <Link
                href="/profile"
                aria-label="User Account"
                className="inline-flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-full text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm font-semibold text-xs"
              >
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">Account</span>
              </Link>
            </div>
          </div>

          {/* MOBILE NAVBAR */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <BrandLogo
                logoUrl={settings?.logo}
                siteTitle={settings?.siteTitle || "Future com"}
                size="sm"
              />
            </Link>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                aria-label="Toggle Search"
                className="p-2 text-stone-800 dark:text-white"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="p-2 relative text-stone-800 dark:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalQty > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-extrabold text-white bg-orange-600 rounded-full">
                    {totalQty}
                  </span>
                )}
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <button aria-label="Toggle Menu" className="p-2 text-stone-800 dark:text-white">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] bg-white dark:bg-gray-900 p-0">
                  <SheetHeader className="p-4 border-b border-stone-200 dark:border-gray-800">
                    <SheetTitle>
                      <BrandLogo
                        logoUrl={settings?.logo}
                        siteTitle={settings?.siteTitle || "Future com"}
                        size="sm"
                      />
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-80px)]">
                    <nav className="flex flex-col p-4 space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.slug === "/categories" ? "/categories/all" : link.slug}
                          className={`block py-2.5 px-4 rounded-xl text-base font-bold transition-colors ${
                            isLinkActive(link.slug)
                              ? "text-white bg-orange-500 shadow-md"
                              : "text-stone-800 dark:text-stone-200 hover:bg-orange-50"
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                      {categories.length > 0 && (
                        <div className="border-t border-stone-200 dark:border-gray-800 pt-3 mt-3">
                          <p className="px-4 text-xs font-extrabold text-orange-600 uppercase tracking-wider mb-2">
                            Product Categories
                          </p>
                          {categories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/categories/${category.slug}`}
                              className={`block py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                                pathname === `/categories/${category.slug}`
                                  ? "text-orange-600 font-bold bg-orange-50"
                                  : "text-stone-700 dark:text-stone-300 hover:bg-stone-100"
                              }`}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="border-t border-stone-200 dark:border-gray-800 pt-4 mt-4 space-y-2">
                        <Link
                          href="/profile"
                          className="flex items-center py-2.5 px-4 rounded-xl text-base font-bold text-stone-800 dark:text-stone-200 hover:bg-orange-50"
                        >
                          <User className="h-5 w-5 mr-3 text-orange-500" /> Account Profile
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center py-2.5 px-4 rounded-xl text-base font-bold text-stone-800 dark:text-stone-200 hover:bg-orange-50"
                        >
                          <Heart className="h-5 w-5 mr-3 text-red-500" /> My Wishlist
                        </Link>
                      </div>
                    </nav>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isSearchVisible ? "max-h-40 border-t border-stone-200/80" : "max-h-0"
          }`}
        >
          <div className="p-4 bg-stone-50 dark:bg-gray-800">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="absolute left-3.5 text-stone-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-stone-300 dark:border-gray-700 text-stone-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                aria-label="Search"
              />
              <button
                type="button"
                onClick={() => setIsSearchVisible(false)}
                className="absolute right-3 text-stone-500 hover:text-orange-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
