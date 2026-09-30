'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// import { signOut } from '@/auth'; // Adjust based on your auth setup

const UserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const validatedFields = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }).safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const { email, password } = validatedFields.data;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, message: 'Invalid credentials.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof AuthError) {
      return { success: false, message: 'Invalid credentials.' };
    }
    return { success: false, message: 'Something went wrong.' };
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    // Validate form data
    const validatedFields = UserSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const { email, password, firstName, lastName } = validatedFields.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
    });

    // Try to sign in the user immediately after registration
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return { success: true, message: 'Registration successful' };
    } catch (signInError) {
      console.error('Auto sign-in after registration failed:', signInError);
      return { success: true, message: 'Registration successful. Please sign in.' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Something went wrong during registration' };
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
