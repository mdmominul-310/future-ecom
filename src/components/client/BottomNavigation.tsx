"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  House,
  Mail,
  // MessageSquare,/
  ShoppingBag,
  // Store,
  User,
} from "lucide-react";

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: House },
    { href: "/contact", label: "Message", icon: Mail },
    { href: "/categories/all", label: "Products", icon: ShoppingBag },
    { href: "/wishlist", label: "Favourite", icon: Heart },
    { href: "/profile", label: "Account", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/category/all") return pathname.startsWith("/category");
    return pathname.startsWith(href);
  };

  return (
    // --- UPGRADED BACKGROUND ---
    // Changed to a semi-transparent background with a backdrop-blur for a frosted glass effect.
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F7F5EF]/80 border-t border-white/20 backdrop-blur-lg flex items-center justify-around z-50">
      {navItems.map(({ href, label, icon: Icon }, index) => {
        const active = isActive(href);
        const isMiddleItem = index === 2;

        if (isMiddleItem) {
          return (
            <Link
              key={href}
              href={href}
              className="relative -translate-y-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 shadow-[0_8px_20px_-5px_rgba(230,81,0,0.5)] transition-transform duration-300 hover:scale-110"
              aria-label={label}
            >
              <Icon className="h-7 w-7 text-white" />
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-300 ${
              active ? "text-orange-600" : "text-gray-500 hover:text-orange-500"
            }`}
          >
            <Icon
              className={`h-6 w-6 transition-transform duration-300 ${
                active ? "scale-110" : ""
              }`}
            />
            <span
              className={`text-[11px] ${
                active ? "font-semibold" : "font-normal"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
