"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: LoginInput) => {
    setAuthError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error || !data.user) {
        setAuthError("Email atau kata sandi salah.");
        return;
      }

      await supabase
        .from("profil_pengguna")
        .upsert({ user_id: data.user.id }, { onConflict: "user_id" });

      toast.success("Berhasil masuk ke PahaMIn!");
      const nextPath = searchParams.get("next");
      const destination =
        nextPath && nextPath.startsWith("/") ? nextPath : "/ruang-paham";
      router.push(destination);
      router.refresh();
    } catch {
      setAuthError("Gagal menghubungi layanan autentikasi. Coba lagi.");
    }
  };

  const handleOAuth = async (provider: "google" | "github" | "apple") => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/ruang-paham` },
      });
      if (error) {
        toast.error("Metode masuk sosial belum diaktifkan pada proyek ini.");
      }
    } catch {
      toast.error("Gagal memulai autentikasi sosial.");
    }
  };

  const socialBtnClass =
    "flex h-12 w-12 cursor-pointer items-center justify-center rounded-[6px] border-[1.5px] border-[#7da2ff] bg-white transition hover:bg-[#f5f8ff]";

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-[38px] leading-tight font-bold text-[#111827]">
        Login
      </h1>
      <p className="mt-1 mb-5 text-center text-[15px] text-[#94a3b8]">
        Welcome back!
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
          <label htmlFor="login-email" className="sr-only">Email</label>
          <div className="flex h-[58px] items-center rounded-[8px] border border-[#cfd5df] bg-[#f5f7fa] px-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition focus-within:border-[#2563eb] focus-within:bg-white">
            <Mail className="mr-3 h-[18px] w-[18px] shrink-0 text-[#6b7280]" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              aria-invalid={Boolean(errors.email)}
              className="w-full bg-transparent text-[14px] text-[#374151] placeholder-[#6b7280] outline-none"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="login-password" className="sr-only">Password</label>
          <div className="flex h-[58px] items-center rounded-[8px] border border-[#cfd5df] bg-[#f5f7fa] px-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition focus-within:border-[#2563eb] focus-within:bg-white">
            <Lock className="mr-3 h-[18px] w-[18px] shrink-0 text-[#6b7280]" />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-invalid={Boolean(errors.password)}
              className="w-full bg-transparent text-[14px] text-[#374151] placeholder-[#6b7280] outline-none"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div className="mt-1 mb-4 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#374151]">
            <input type="checkbox" className="h-[15px] w-[15px] rounded border-[#cfd5df] accent-[#2563eb]" {...register("rememberMe")} />
            <span>Remember me</span>
          </label>
          <Link href="/register" className="text-[13px] font-medium text-[#2563eb] hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-[52px] w-full cursor-pointer rounded-[8px] bg-[#2962ff] text-[18px] font-semibold text-white transition hover:bg-[#1f54e8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-[#4b5563]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#2563eb] hover:underline">Sign In</Link>
      </p>

      <div className="mt-5 mb-4 text-center text-[14px] text-[#4b5563]">or continue With</div>

      <div className="flex justify-center gap-3.5">
        <button type="button" onClick={() => void handleOAuth("google")} aria-label="Login dengan Google" className={socialBtnClass}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => void handleOAuth("github")} aria-label="Login dengan GitHub" className={socialBtnClass}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => void handleOAuth("apple")} aria-label="Login dengan Apple" className={`${socialBtnClass} text-2xl font-medium text-[#111827]`}>
          
        </button>
      </div>
    </div>
  );
}
