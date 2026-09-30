// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "super_secret_jwt_key_change_me_in_production",
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // --- UPDATED: Pass additional fields to the session ---
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
        // Add the new fields to the session user object
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.address = token.address as any; // Or use a specific Address type
      }
      return session;
    },
    // --- UPDATED: Pass additional fields to the token ---
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        // Add the new fields to the token
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.address = user.address;
      }
      return token;
    },
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAuthPage =
        nextUrl.pathname.startsWith("/signin") ||
        nextUrl.pathname.startsWith("/signup");

      if (isAuthPage) {
        if (isLoggedIn)
          return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        if (userRole !== "admin") {
          return Response.redirect(new URL("/unauthorized", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Credentials added in auth.ts
} satisfies NextAuthConfig;
