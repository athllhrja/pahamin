import type { ReactNode } from "react";
import {
  Bell,
  CircleUserRound,
  Folder,
  LayoutGrid,
  ListTodo,
  Mic,
  SquarePlus,
  Sparkles,
  UserRound,
} from "lucide-react";

interface AuthShellBackdropProps {
  children: ReactNode;
}

export function AuthShellBackdrop({ children }: AuthShellBackdropProps) {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#f8fafc] select-none">
      <aside className="flex w-[72px] shrink-0 flex-col items-center justify-between border-r border-[#e5e7eb] bg-white py-5">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#2563eb]">
            <img
              src="/logo_pahamin.png"
              alt="PahaMIn"
              className="h-full w-full object-contain"
            />
          </div>
          <nav className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-12 items-center justify-center rounded-lg text-[#9ca3af]">
              <SquarePlus className="h-5 w-5" />
            </div>
            <div className="flex h-10 w-12 items-center justify-center border-l-2 border-[#2563eb] bg-[#eff6ff] text-[#2563eb]">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="flex h-10 w-12 items-center justify-center rounded-lg text-[#9ca3af]">
              <ListTodo className="h-5 w-5" />
            </div>
            <div className="mt-4 flex h-10 w-12 items-center justify-center rounded-lg text-[#9ca3af]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex h-10 w-12 items-center justify-center rounded-lg text-[#9ca3af]">
              <Folder className="h-5 w-5" />
            </div>
          </nav>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-[#9ca3af]">
          <CircleUserRound className="h-5 w-5" />
        </div>
      </aside>

      <div className="relative flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end gap-4 border-b border-[#e5e7eb]/60 bg-white/80 px-8">
          <Bell className="h-5 w-5 text-[#9ca3af]" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-white">
            <UserRound className="h-4 w-4" />
          </div>
        </header>

        <div className="relative flex flex-1 flex-col items-center justify-center px-6">
          <div className="pointer-events-none absolute h-72 w-72 -translate-x-36 rounded-full bg-pink-200/35 blur-3xl" />
          <div className="pointer-events-none absolute h-72 w-72 translate-x-36 rounded-full bg-yellow-200/35 blur-3xl" />
          <h2 className="text-4xl font-bold tracking-tight text-[#111827]">
            Sederhanakan <span className="text-[#2563eb]">Materimu</span>
          </h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Semua materi jadi lebih mudah dipahami di sini
          </p>
          <div className="mt-8 flex h-14 w-full max-w-xl items-center justify-between rounded-2xl border border-[#e5e7eb] bg-white px-5 shadow-sm">
            <span className="text-sm text-[#9ca3af]">Materi apa hari ini...</span>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#2563eb] px-4 py-1.5 text-xs font-semibold text-white">
                Add +
              </span>
              <Mic className="h-4 w-4 text-[#6b7280]" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#ebf0f6]/75 px-4 backdrop-blur-[3px] select-auto">
        <div className="flex w-full max-w-[500px] flex-col rounded-[28px] bg-white px-8 py-9 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
