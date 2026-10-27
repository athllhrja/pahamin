import type { Metadata } from "next";
import { AuthShellBackdrop } from "@/components/auth/auth-shell-backdrop";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar Akun",
};

export default function RegisterPage() {
  return (
    <AuthShellBackdrop>
      <RegisterForm />
    </AuthShellBackdrop>
  );
}
