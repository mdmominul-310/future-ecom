import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Validate input
    const validatedFields = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }).safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid form data' },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error('Sign-in error:', result.error);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
} 