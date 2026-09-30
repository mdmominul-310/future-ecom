// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import User from "@/models/User"; // Assuming your User model has the new fields
import { connectDB } from "@/lib/mongodb";

async function getUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // --- UPDATED: Return the additional user data here ---
            return {
              id: user._id.toString(),
              email: user.email,
              role: user.role,
              image: user.image,
              firstName: user.firstName,
              lastName: user.lastName,
              address: user.address, // Make sure 'address' exists on your User model
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
