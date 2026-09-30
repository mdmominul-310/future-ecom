import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Define a custom Address type that matches your data structure
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

// Extend the default JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    address?: Address;
  }
}

// Extend the default User and Session types
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    firstName?: string;
    lastName?: string;
    address?: Address;
  }

  interface Session {
    user: {
      role?: string;
      id?: string;
      firstName?: string;
      lastName?: string;
      address?: Address;
    } & DefaultSession["user"]; // Keep the default properties
  }
}
