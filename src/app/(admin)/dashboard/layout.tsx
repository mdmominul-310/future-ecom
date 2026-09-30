import React from "react";
import { SidebarProvider } from "@/context/SidebarContext"; // The context provider
import DashboardClientWrapper from "./DashboardClientWrapper"; // The new client wrapper
import { auth } from "@/auth"; // Make sure this path is correct

// This is now an async Server Component to fetch session data.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session data on the server.
  const session = await auth();

  return (
    // The provider component is a Client Component, but it can be used in a Server Component
    // to provide context to the client components nested within it.
    <SidebarProvider>
      {/* Pass the server-side session data down to the client wrapper */}
      <DashboardClientWrapper session={session}>
        {children}
      </DashboardClientWrapper>
    </SidebarProvider>
  );
}
