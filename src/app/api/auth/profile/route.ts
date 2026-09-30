import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { Types } from 'mongoose';
import { z } from 'zod';

interface UserDocument extends Omit<IUser, '_id'> {
  _id: Types.ObjectId;
  __v: number;
}

// Validation schema for profile updates
const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().optional().nullable(),
  address: z.object({
    street: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
  }).optional().nullable(),
});

export async function GET() {
  try {
    // Get session
    const session = await auth();
    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email })
      .select('-password') // Exclude password
      .lean() as UserDocument; // Convert to plain object with proper typing

    // console.log('Found user:', user);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return formatted user data
    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user',
      address: user.address || undefined,
      phone: user.phone || undefined,
      image: user.image || undefined,
      wishlist: user.wishlist || [],
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get session
    const session = await auth();
    
    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Update profile request body:', body);
    
    // Validate input data
    const validationResult = ProfileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const updateData = validationResult.data;

    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    
    // Only update phone if it's explicitly included in the request
    if ('phone' in updateData) {
      user.phone = updateData.phone || undefined;
    }
    
    // Update address if provided
    if (updateData.address) {
      user.address = {
        ...user.address || {},
        ...updateData.address
      };
    }
    
    // Save the updated user
    await user.save();
    
    // Return updated user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        address: user.address,
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 