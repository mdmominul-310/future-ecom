"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/components/dashboard/layout/AppHeader";
import AppSidebar from "@/components/dashboard/layout/AppSidebar";
import Backdrop from "@/components/dashboard/layout/Backdrop";

export default function DashboardClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  // This hook makes this component a Client Component.
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // All logic that depends on the hook's state lives here.
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex bg-stone-50/80 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-orange-500 selection:text-white transition-colors">
      {/* These are interactive client components */}
      <AppSidebar />
      <Backdrop />

      {/* This div's style changes based on client-side state */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader session={session} />
        <main className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex-1">
          {/* The children, which are Server Components, are passed through */}
          {children}
        </main>
        <footer className="py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
          <span>&copy; {new Date().getFullYear()} Future com. </span>
          <span className="font-medium">
            Powered by{" "}
            <a
              href="https://futgensoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
            >
              Futgensoft
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
