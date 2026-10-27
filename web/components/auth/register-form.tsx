"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";

export function RegisterForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setAuthError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            username: values.fullName,
          },
        },
      });

      if (error || !data.user) {
        setAuthError(
          "Pendaftaran gagal diproses. Pastikan email belum terdaftar dan kata sandi memenuhi syarat."
        );
        return;
      }

      if (data.session) {
        await supabase
          .from("profil_pengguna")
          .upsert({ user_id: data.user.id }, { onConflict: "user_id" });

        toast.success("Akun berhasil dibuat! Selamat datang di PahaMIn.");
        router.push("/ruang-paham");
        router.refresh();
        return;
      }

      toast.success(
        "Pendaftaran berhasil! Silakan periksa email Anda atau masuk ke akun Anda."
      );
      router.push("/login");
    } catch {
      setAuthError("Gagal menghubungi layanan autentikasi. Coba lagi.");
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-[38px] leading-tight font-bold text-[#111827]">
        Sign In
      </h1>
      <p className="mt-1 mb-5 text-center text-[15px] text-[#94a3b8]">
        Enter your credential here
      </p>

      {authError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600"
        >
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
        <div className="mb-3">
          <label htmlFor="register-name" className="sr-only">
            Nama Lengkap
          </label>
          <div className="flex h-[58px] items-center rounded-[8px] border border-[#cfd5df] bg-[#f5f7fa] px-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition focus-within:border-[#2563eb] focus-within:bg-white">
            <User className="mr-3 h-[18px] w-[18px] shrink-0 text-[#6b7280]" />
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Nama Lengkap"
              aria-invalid={Boolean(errors.fullName)}
              className="w-full bg-transparent text-[14px] text-[#374151] placeholder-[#6b7280] outline-none"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="register-email" className="sr-only">
            Email
          </label>
          <div className="flex h-[58px] items-center rounded-[8px] border border-[#cfd5df] bg-[#f5f7fa] px-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition focus-within:border-[#2563eb] focus-within:bg-white">
            <Mail className="mr-3 h-[18px] w-[18px] shrink-0 text-[#6b7280]" />
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              aria-invalid={Boolean(errors.email)}
              className="w-full bg-transparent text-[14px] text-[#374151] placeholder-[#6b7280] outline-none"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="register-password" className="sr-only">
            Password
          </label>
          <div className="flex h-[58px] items-center rounded-[8px] border border-[#cfd5df] bg-[#f5f7fa] px-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition focus-within:border-[#2563eb] focus-within:bg-white">
            <Lock className="mr-3 h-[18px] w-[18px] shrink-0 text-[#6b7280]" />
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Password (min. 8 karakter)"
              aria-invalid={Boolean(errors.password)}
              className="w-full bg-transparent text-[14px] text-[#374151] placeholder-[#6b7280] outline-none"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mt-1 mb-5 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#374151]">
            <input
              type="checkbox"
              className="h-[15px] w-[15px] rounded border-[#cfd5df] accent-[#2563eb]"
              {...register("rememberMe")}
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#2563eb] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-[52px] w-full cursor-pointer rounded-[8px] bg-[#2962ff] text-[18px] font-semibold text-white transition hover:bg-[#1f54e8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Loading..." : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs font-medium text-[#111827]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2563eb] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
