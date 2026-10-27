"use client";

import { useRef, useState } from "react";
import {
  Coffee,
  FileText,
  Lightbulb,
  ListOrdered,
  Mic,
  Send,
  Sparkles,
  X,
} from "lucide-react";

export type ExplanationMode = "santai" | "analogi" | "step-by-step";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ potongan_id: string; halaman: number }>;
  fileName?: string;
}

interface ChatWorkspaceProps {
  messages: ChatMessageItem[];
  loading: boolean;
  activeStyle: ExplanationMode;
  onChangeStyle: (mode: ExplanationMode) => void;
  onSend: (question: string, file: File | null) => Promise<void>;
}

const STYLE_MODES: Array<{ key: ExplanationMode; label: string; icon: typeof Coffee }> = [
  { key: "santai", label: "Santai", icon: Coffee },
  { key: "analogi", label: "Analogi", icon: Lightbulb },
  { key: "step-by-step", label: "Step-by-step", icon: ListOrdered },
];

export function ChatWorkspace({
  messages,
  loading,
  activeStyle,
  onChangeStyle,
  onSend,
}: ChatWorkspaceProps) {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isChatMode = messages.length > 0;

  const handleSubmit = async () => {
    if (!inputText.trim() && !selectedFile) return;
    const textToSend = inputText.trim();
    const fileToSend = selectedFile;
    setInputText("");
    setSelectedFile(null);
    await onSend(textToSend, fileToSend);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setSelectedFile(file);
      }}
      className="relative flex flex-1 flex-col items-center justify-between overflow-hidden px-6 py-6"
    >
      {dragActive && (
        <div className="absolute inset-4 z-30 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#2563eb] bg-[#eff6ff]/90 backdrop-blur-xs">
          <FileText className="h-12 w-12 text-[#2563eb]" />
          <p className="mt-3 text-base font-semibold text-[#1e40af]">
            Lepaskan file PDF di sini untuk diunggah (maks. 5 MB)
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute top-1/3 h-72 w-72 -translate-x-40 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 h-72 w-72 translate-x-40 rounded-full bg-yellow-200/30 blur-3xl" />

      <div className="z-10 flex items-center gap-1 rounded-full border border-[#dbeafe] bg-[#eff6ff]/90 p-1 shadow-xs">
        {STYLE_MODES.map((mode) => {
          const IconComponent = mode.icon;
          const isActive = activeStyle === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => onChangeStyle(mode.key)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                isActive ? "bg-white font-semibold text-[#2563eb] shadow-xs" : "text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              <IconComponent className="h-3.5 w-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {!isChatMode ? (
        <div className="z-10 flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
            Sederhanakan <span className="text-[#2563eb]">Materimu</span>
          </h1>
          <p className="mt-3 text-sm text-[#6b7280] sm:text-base">
            Semua materi jadi lebih mudah dipahami di sini
          </p>
        </div>
      ) : (
        <div className="z-10 my-4 flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto rounded-3xl border border-[#e5e7eb] bg-white/90 p-6 shadow-xs">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "bg-[#2563eb] text-white" : "border border-[#e5e7eb] bg-[#f8fafc] text-[#111827]"
                }`}
              >
                {msg.fileName && (
                  <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-lg bg-black/10 px-2.5 py-1 text-xs">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{msg.fileName}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 border-t border-[#e5e7eb] pt-2">
                    {msg.sources.map((src) => (
                      <span key={src.potongan_id} className="rounded-md bg-[#eff6ff] px-2 py-0.5 text-[11px] font-medium text-[#2563eb]">
                        Halaman {src.halaman}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div aria-live="polite" aria-busy="true" className="flex items-center gap-2 text-xs text-[#6b7280]">
              <Sparkles className="h-4 w-4 animate-spin text-[#2563eb]" />
              <span>PahaMIn sedang memproses materi...</span>
            </div>
          )}
        </div>
      )}

      <div className="z-10 w-full max-w-2xl">
        {selectedFile && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3.5 py-1.5 text-xs font-medium text-[#1e40af]">
            <FileText className="h-3.5 w-3.5" />
            <span className="max-w-xs truncate">{selectedFile.name}</span>
            <button type="button" onClick={() => setSelectedFile(null)} aria-label="Hapus lampiran" className="cursor-pointer rounded-full p-0.5 hover:bg-[#dbeafe]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex h-14 w-full items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus-within:border-[#2563eb]">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} className="hidden" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSubmit(); } }}
            placeholder="Materi apa hari ini..."
            className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9ca3af] outline-none"
          />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-full bg-[#2563eb] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1d4ed8]">
            Add +
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading || (!inputText.trim() && !selectedFile)}
            aria-label="Kirim pesan"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#2563eb] disabled:opacity-40"
          >
            {inputText.trim() || selectedFile ? <Send className="h-4 w-4 text-[#2563eb]" /> : <Mic className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
