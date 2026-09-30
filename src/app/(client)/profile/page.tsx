"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  // Heart,
  MapPin,
  Mail,
  Phone,
  // Edit,
  EllipsisVertical,
  // KeyRound,
} from "lucide-react";

import SignOutButton from "@/components/SignOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Interfaces (No Changes)
interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  phone?: string;
  image?: string;
  wishlist?: string[];
}

interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

// --- Skeleton Component for the new layout ---
function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="p-4 bg-gray-200 rounded-lg h-48"></div>
        </div>
        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 bg-gray-200 rounded-lg h-24"></div>
          <div className="p-6 bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    </div>
  );
}

// --- Sidebar Navigation Component ---
const ProfileSidebar = () => (
  <Card>
    <CardContent className="p-4">
      <nav className="flex flex-row lg:flex-col gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold bg-orange-100 text-orange-600 rounded-lg"
        >
          <User size={18} />
          <span className="hidden sm:inline">My Profile</span>
        </Link>
        <Link
          href="/profile/orders"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Package size={18} />
          <span className="hidden sm:inline">My Orders</span>
        </Link>
      </nav>
    </CardContent>
  </Card>
);

// --- Main Page Component ---
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: { street: "", city: "", postalCode: "", country: "" },
  });
  const router = useRouter();

  // Data Fetching and Handlers (No Changes)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          router.push("/signin");
          return;
        }
        const data = await response.json();
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            postalCode: data.address?.postalCode || "",
            country: data.address?.country || "",
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      const result = await response.json();
      setProfile(result.user);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  // Render Logic
  if (loading) return <ProfilePageSkeleton />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No profile data available
      </div>
    );

  const userInitials = (profile.name || "U").charAt(0).toUpperCase();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- Sidebar --- */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* --- Main Content --- */}
          <div className="lg:col-span-3 space-y-8">
            {isEditing ? (
              // --- EDITING VIEW ---
              <Card>
                <CardHeader>
                  <CardTitle>Edit Your Profile</CardTitle>
                  <CardDescription>
                    Update your personal details and address information below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {updateError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm">
                      {updateError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-4 rounded-lg border p-4">
                      <h3 className="font-semibold text-gray-800">Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address.street">Street</Label>
                          <Input
                            id="address.street"
                            name="address.street"
                            value={formData.address?.street || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address.city">City</Label>
                          <Input
                            id="address.city"
                            name="address.city"
                            value={formData.address?.city || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address.postalCode">
                            Postal Code
                          </Label>
                          <Input
                            id="address.postalCode"
                            name="address.postalCode"
                            value={formData.address?.postalCode || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address.country">Country</Label>
                          <Input
                            id="address.country"
                            name="address.country"
                            value={formData.address?.country || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={updating}>
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              // --- VIEWING VIEW ---
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-6 space-y-0">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-3xl font-bold">
                      {userInitials}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{profile.name}</CardTitle>
                      <CardDescription>{profile.email}</CardDescription>
                      {updateSuccess && (
                        <p className="text-sm text-green-600 mt-2">
                          Profile updated successfully!
                        </p>
                      )}
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setIsEditing(true)}>
                            Edit Profile
                          </DropdownMenuItem>
                          {profile.role === "admin" && (
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard">Go to Dashboard</Link>
                            </DropdownMenuItem>
                          )}
                          {/* <DropdownMenuItem asChild>
                            <Link href="/profile/changepassword">
                              Change Password
                            </Link>
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50">
                            <SignOutButton />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-center gap-3">
                        <Mail className="text-gray-500" size={18} />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="text-gray-500" size={18} />
                        <span>{profile.phone || "Not provided"}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-500 mt-1" size={18} />
                        <div>
                          {profile.address &&
                          (profile.address.street || profile.address.city) ? (
                            <>
                              <p>{profile.address.street}</p>
                              <p>
                                {profile.address.city},{" "}
                                {profile.address.postalCode}
                              </p>
                              <p>{profile.address.country}</p>
                            </>
                          ) : (
                            "No address provided."
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
