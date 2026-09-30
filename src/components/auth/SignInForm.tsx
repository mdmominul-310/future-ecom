"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import Label from "../custom/form/Label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Checkbox from "../custom/form/input/Checkbox";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Authentication failed");
        return;
      }

      // Redirect to callback URL or dashboard
      router.push(callbackUrl);
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred during sign in");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeftIcon />
            Back to dashboard
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500">
              Enter your email and password to sign in!
            </p>
          </div>
          <form action={handleSubmit} className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input type="email" name="email" />
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <input type="hidden" name="redirectTo" value={callbackUrl} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm text-gray-700">Keep me logged in</span>
              </div>
              <Link
                href="/forgetpassword"
                className="text-sm text-brand-500 hover:text-brand-600"
              >
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" size="sm" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>

            {/* Error message */}
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <span className="text-sm text-red-500">{errorMessage}</span>
                </>
              )}
            </div>
          </form>

          <p className="mt-5 text-sm text-center text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand-500 hover:text-brand-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
