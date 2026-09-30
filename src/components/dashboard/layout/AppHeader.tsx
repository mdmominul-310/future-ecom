"use client";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useSidebar } from "@/context/SidebarContext";
import React, { useEffect, useRef } from "react";
import NotificationDropdown from "../header/NotificationDropdown";
import UserDropdown from "../header/UserDropdown";

// 1. Define a more specific type for the user object based on your session data.
interface SessionUser {
  id: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  email: string;
  role: string;
}

// 2. Define the custom session type that includes the specific user object.
interface CustomSession {
  expires: string;
  user: SessionUser;
}

// 3. Define an interface for the component's props using the new CustomSession type.
interface AppHeaderProps {
  session: CustomSession | null;
}

// 4. Use the new interface to type the component's props.
import Link from "next/link";
import { ExternalLink, Sparkles, Store } from "lucide-react";

const AppHeader = ({ session }: AppHeaderProps) => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 h-18 flex w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 z-30 transition-colors">
      <div className="flex items-center justify-between w-full px-4 md:px-6">
        {/* Left: Sidebar Toggle & Store Indicator */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="14"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Store badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Future com Admin</span>
          </div>
        </div>

        {/* Right: Actions, Live Storefront, Theme, Notifications & User */}
        <div className="flex items-center gap-3">
          {/* Live Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-orange-200 dark:border-orange-900/60 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 text-orange-700 dark:text-orange-300 hover:border-orange-500 transition-all shadow-sm"
          >
            <Store className="w-3.5 h-3.5 text-orange-500" />
            <span>View Store</span>
            <ExternalLink className="w-3 h-3 text-orange-400" />
          </Link>

          <div className="h-5 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />

          {/* Theme Toggle Button */}
          <ThemeToggleButton />

          {/* Notification */}
          <NotificationDropdown />

          {/* User Profile Dropdown */}
          <UserDropdown session={session} />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
