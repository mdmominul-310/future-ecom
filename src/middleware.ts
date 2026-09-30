// src/middleware.ts

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Initialize NextAuth with your configuration and export the 'auth' middleware
export default NextAuth(authConfig).auth;

export const config = {
  // The matcher specifies which routes the middleware should run on.
  // This pattern runs it on all routes except for static files and API routes.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
