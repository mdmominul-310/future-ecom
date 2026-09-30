"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronLeftIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import Checkbox from "../custom/form/input/Checkbox";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";

export default function SignUpForm() {
  const [modal, setModal] = useState({
    open: false,
    success: true,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Registration failed");
        return;
      }

      setModal({
        open: true,
        success: true,
        message: "Registration successful! Please sign in.",
      });
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred during registration");
    } finally {
      setIsPending(false);
    }
  };

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
              Sign Up
            </h1>
            <p className="text-sm text-gray-500">
              Create your account to get started!
            </p>
          </div>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input type="text" name="firstName" />
              </div>
              <div>
                <Label>
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input type="text" name="lastName" />
              </div>
            </div>
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

            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-brand-500 hover:text-brand-600"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-brand-500 hover:text-brand-600"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button
              className="w-full"
              size="sm"
              disabled={!isChecked || isPending}
            >
              {isPending ? "Creating account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Dialog
        open={modal.open}
        onOpenChange={() => setModal({ ...modal, open: false })}
      >
        <DialogContent>
          <DialogTitle
            className={modal.success ? "text-green-600" : "text-red-600"}
          >
            {modal.success ? "Success" : "Error"}
          </DialogTitle>
          <p className="text-gray-700">{modal.message}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
