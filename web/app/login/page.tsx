import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShellBackdrop } from "@/components/auth/auth-shell-backdrop";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShellBackdrop>
      <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-slate-100" />}>
        <LoginForm />
      </Suspense>
    </AuthShellBackdrop>
  );
}
