import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Maven Zone SignUp Page | Best Shopping website in Bangladesh",
  description: "This is Maven Zone Sign Up Page ",
};

export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
