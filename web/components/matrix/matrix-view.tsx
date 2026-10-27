"use client";

import { useState } from "react";
import { AlertCircle, Calendar, Check, Mic, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export type QuadrantKey = "DO" | "DECIDE" | "DELEGATE" | "DELETE";

export interface MatrixTaskItem {
  id: string;
  judul: string;
  mendesak: boolean;
  penting: boolean;
  selesai: boolean;
}

interface MatrixViewProps {
  userId: string;
  userEmail: string;
  displayName: string;
  initialTasks: MatrixTaskItem[];
}

const QUADRANT_CONFIG = [
  { key: "DO" as const, label: "Do", desc: "URGENT & IMPORTANT", mendesak: true, penting: true, borderClass: "border-t-[3px] border-t-red-500", badgeClass: "bg-red-100 text-red-600", iconClass: "bg-red-100 text-red-500", icon: AlertCircle },
  { key: "DECIDE" as const, label: "Decide", desc: "IMPORTANT, NOT URGENT", mendesak: false, penting: true, borderClass: "border-t-[3px] border-t-blue-500", badgeClass: "bg-blue-100 text-blue-600", iconClass: "bg-blue-100 text-blue-500", icon: Calendar },
  { key: "DELEGATE" as const, label: "Delegate", desc: "URGENT, NOT IMPORTANT", mendesak: true, penting: false, borderClass: "border-t-[3px] border-t-amber-500", badgeClass: "bg-amber-100 text-amber-600", iconClass: "bg-amber-100 text-amber-500", icon: Users },
  { key: "DELETE" as const, label: "Delete", desc: "NEITHER", mendesak: false, penting: false, borderClass: "border-t-[3px] border-t-gray-500", badgeClass: "bg-gray-100 text-gray-600", iconClass: "bg-gray-100 text-gray-500", icon: Trash2 },
];

function getTaskQuadrant(task: MatrixTaskItem): QuadrantKey {
  if (task.mendesak && task.penting) return "DO";
  if (!task.mendesak && task.penting) return "DECIDE";
  if (task.mendesak && !task.penting) return "DELEGATE";
  return "DELETE";
}

export function MatrixView({ userId, userEmail, displayName, initialTasks }: MatrixViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasks, setTasks] = useState<MatrixTaskItem[]>(initialTasks);
  const [inputText, setInputText] = useState("");

  const handleAddTask = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const newTask: MatrixTaskItem = {
      id: crypto.randomUUID(),
      judul: trimmed.slice(0, 150),
      mendesak: true,
      penting: true,
      selesai: false,
    };
    const previous = tasks;
    setTasks((prev) => [newTask, ...prev]);
    setInputText("");
    try {
      const supabase = createClient();
      await supabase.from("tugas").insert({
        tugas_id: newTask.id,
        user_id: userId,
        judul: newTask.judul,
        mendesak: true,
        penting: true,
        selesai: false,
      });
    } catch {
      setTasks(previous);
      toast.error("Gagal menambahkan tugas.");
    }
  };

  const handleToggleDone = async (taskId: string, currentDone: boolean) => {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, selesai: !currentDone } : t)));
    try {
      const supabase = createClient();
      await supabase.from("tugas").update({ selesai: !currentDone }).eq("tugas_id", taskId);
    } catch {
      setTasks(previous);
      toast.error("Gagal memperbarui status tugas.");
    }
  };

  const handleMoveQuadrant = async (taskId: string, targetKey: QuadrantKey) => {
    const target = QUADRANT_CONFIG.find((q) => q.key === targetKey);
    if (!target) return;
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, mendesak: target.mendesak, penting: target.penting } : t))
    );
    try {
      const supabase = createClient();
      await supabase.from("tugas").update({ mendesak: target.mendesak, penting: target.penting }).eq("tugas_id", taskId);
    } catch {
      setTasks(previous);
      toast.error("Gagal memindahkan kuadran tugas.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        documents={[]}
        activeDocId={null}
        onSelectDoc={() => {}}
        onNewSession={() => {}}
      />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AppHeader userEmail={userEmail} displayName={displayName} />
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-6 pb-24 md:grid-cols-2">
          {QUADRANT_CONFIG.map((quad) => {
            const IconComp = quad.icon;
            const quadTasks = tasks.filter((t) => getTaskQuadrant(t) === quad.key);
            return (
              <div key={quad.key} className={`flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs ${quad.borderClass}`}>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${quad.iconClass}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">{quad.label}</h3>
                      <p className="text-[11px] font-medium tracking-wider text-[#9ca3af] uppercase">{quad.desc}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${quad.badgeClass}`}>
                    {quadTasks.length} Tasks
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {quadTasks.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-xs text-[#9ca3af] italic">Belum ada tugas</div>
                  ) : (
                    quadTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5">
                        <button type="button" onClick={() => void handleToggleDone(task.id, task.selesai)} className="flex flex-1 cursor-pointer items-center gap-2.5 text-left">
                          <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${task.selesai ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#d1d5db] bg-white"}`}>
                            {task.selesai && <Check className="h-3 w-3" />}
                          </span>
                          <span className={`text-sm ${task.selesai || quad.key === "DELETE" ? "text-[#9ca3af] line-through" : "text-[#111827]"}`}>
                            {task.judul}
                          </span>
                        </button>
                        <select
                          aria-label={`Pindahkan ${task.judul}`}
                          value={quad.key}
                          onChange={(e) => void handleMoveQuadrant(task.id, e.target.value as QuadrantKey)}
                          className="rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-[11px] font-medium text-[#6b7280]"
                        >
                          {QUADRANT_CONFIG.map((opt) => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-6 left-1/2 z-30 flex w-full max-w-lg -translate-x-1/2 items-center gap-2 rounded-full border border-[#e5e7eb] bg-white py-2 pr-2 pl-5 shadow-md">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleAddTask()}
            placeholder="Materi apa hari ini..."
            className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9ca3af] outline-none"
          />
          <button type="button" onClick={() => void handleAddTask()} className="cursor-pointer rounded-full bg-[#2563eb] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1d4ed8]">
            Add +
          </button>
          <button type="button" aria-label="Input suara" className="p-1.5 text-[#9ca3af] hover:text-[#6b7280]">
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
