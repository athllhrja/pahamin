"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "welcome",
    icon: "👋",
    title: "Selamat datang di PahaMIn!",
    desc: "Mulai unggah materi PDF dan kelola prioritas tugasmu.",
    time: "Baru saja",
    read: false,
  },
  {
    id: "streak",
    icon: "🔥",
    title: "Pertahankan ritme belajarmu",
    desc: "Tanya materi di Ruang Paham hari ini untuk menjaga streak.",
    time: "1 jam lalu",
    read: true,
  },
];

interface AppHeaderProps {
  userEmail: string;
  displayName: string;
  title?: string;
}

export function AppHeader({ userEmail, displayName, title = "PahamIn" }: AppHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const initials = (displayName || userEmail || "U")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Anda telah keluar dari akun.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar dari sesi. Silakan coba lagi.");
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb]/70 bg-white/85 px-6 backdrop-blur-xs">
      <div className="text-xl font-bold tracking-tight text-[#2563eb]">{title}</div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifikasi"
            onClick={() => { setShowNotifications((prev) => !prev); setShowDropdown(false); }}
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />}
          </button>

          {showNotifications && (
            <div className="absolute top-11 right-0 z-40 w-80 rounded-2xl border border-[#e5e7eb] bg-white p-3 shadow-lg">
              <div className="mb-2 flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-[#111827]">Notifikasi</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                    className="cursor-pointer text-xs font-medium text-[#2563eb] hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {notifications.map((item) => (
                  <div key={item.id} className={`flex items-start gap-3 rounded-xl p-2.5 text-xs ${item.read ? "bg-white" : "bg-[#eff6ff]/70"}`}>
                    <span className="text-base">{item.icon}</span>
                    <div className="flex flex-1 flex-col">
                      <span className="font-semibold text-[#111827]">{item.title}</span>
                      <span className="mt-0.5 text-[#6b7280]">{item.desc}</span>
                      <span className="mt-1 text-[11px] text-[#9ca3af]">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => { setShowDropdown((prev) => !prev); setShowNotifications(false); }}
            aria-label="Menu profil"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white shadow-xs transition hover:bg-[#1d4ed8]"
          >
            {initials}
          </button>

          {showDropdown && (
            <div className="absolute top-11 right-0 z-40 w-52 rounded-xl border border-[#e5e7eb] bg-white p-1.5 shadow-lg">
              <div className="border-b border-[#f3f4f6] px-3 py-2">
                <p className="truncate text-xs font-semibold text-[#111827]">{displayName}</p>
                <p className="truncate text-[11px] text-[#6b7280]">{userEmail}</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowDropdown(false); router.push("/profile"); }}
                className="mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#374151] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
              >
                <UserRound className="h-4 w-4" />
                <span>Profil</span>
              </button>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
