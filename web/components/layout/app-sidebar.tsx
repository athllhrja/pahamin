"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  LayoutGrid,
  ListTodo,
  Menu,
  MessageSquare,
  SquarePlus,
  Trash2,
} from "lucide-react";

export interface SidebarDocumentItem {
  id: string;
  title: string;
  status?: string;
}

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  documents: SidebarDocumentItem[];
  activeDocId: string | null;
  onSelectDoc: (id: string) => void;
  onNewSession: () => void;
  onDeleteDoc?: (id: string) => void;
}

export function AppSidebar({
  isCollapsed,
  onToggle,
  documents,
  activeDocId,
  onSelectDoc,
  onNewSession,
  onDeleteDoc,
}: AppSidebarProps) {
  const pathname = usePathname();
  const isRuangPaham = pathname === "/ruang-paham" || pathname === "/";
  const isMatrix = pathname.startsWith("/matrix") || pathname.startsWith("/tugas");

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-[#e5e7eb] bg-white transition-all duration-300 ${
        isCollapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-[#f3f4f6] ${
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        <button
          type="button"
          onClick={isCollapsed ? onToggle : onNewSession}
          className="flex cursor-pointer items-center gap-2.5 text-left"
          title={isCollapsed ? "Buka Sidebar" : "PahaMIn"}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2563eb]">
            <img
              src="/logo_pahamin.png"
              alt="PahaMIn Logo"
              className="h-full w-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-[#2563eb]">
              PahamIn
            </span>
          )}
        </button>

        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Ciutkan sidebar"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onNewSession}
            title={isCollapsed ? "Notebook baru" : undefined}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827] ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <SquarePlus className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Notebook baru</span>}
          </button>

          <Link
            href="/ruang-paham"
            onClick={onNewSession}
            title={isCollapsed ? "Ruang Paham" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isCollapsed ? "justify-center px-0" : ""
            } ${
              isRuangPaham
                ? "border-l-[3px] border-[#2563eb] bg-[#eff6ff] font-semibold text-[#2563eb]"
                : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
            }`}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Ruang Paham</span>}
          </Link>

          <Link
            href="/matrix"
            title={isCollapsed ? "Matriks Tugas" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isCollapsed ? "justify-center px-0" : ""
            } ${
              isMatrix
                ? "border-l-[3px] border-[#2563eb] bg-[#eff6ff] font-semibold text-[#2563eb]"
                : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
            }`}
          >
            <ListTodo className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Matriks Tugas</span>}
          </Link>
        </nav>

        {!isCollapsed && documents.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="px-3 pb-1 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Percakapan
            </span>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                  doc.id === activeDocId
                    ? "bg-[#eff6ff] font-semibold text-[#2563eb]"
                    : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectDoc(doc.id)}
                  className="flex flex-1 cursor-pointer items-center gap-2 truncate text-left"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{doc.title}</span>
                </button>
                {onDeleteDoc && (
                  <button
                    type="button"
                    onClick={() => onDeleteDoc(doc.id)}
                    aria-label={`Hapus ${doc.title}`}
                    className="ml-2 hidden cursor-pointer rounded p-1 text-[#9ca3af] hover:bg-red-50 hover:text-red-600 group-hover:inline-flex"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#e5e7eb] p-3">
        <Link
          href="/profile"
          title={isCollapsed ? "Setelan & bantuan" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827] ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <CircleUserRound className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Setelan &amp; bantuan</span>}
        </Link>
      </div>
    </aside>
  );
}
