"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/layout/app-header";
import {
  AppSidebar,
  type SidebarDocumentItem,
} from "@/components/layout/app-sidebar";
import {
  ChatWorkspace,
  type ChatMessageItem,
  type ExplanationMode,
} from "@/components/ruang-paham/chat-workspace";

interface RuangPahamViewProps {
  userId: string;
  userEmail: string;
  displayName: string;
  initialDocuments: SidebarDocumentItem[];
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function RuangPahamView({
  userId,
  userEmail,
  displayName,
  initialDocuments,
}: RuangPahamViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [documents, setDocuments] =
    useState<SidebarDocumentItem[]>(initialDocuments);
  const [activeDocId, setActiveDocId] = useState<string | null>(
    initialDocuments[0]?.id ?? null
  );
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStyle, setActiveStyle] = useState<ExplanationMode>("santai");

  const handleSelectDoc = async (docId: string) => {
    setActiveDocId(docId);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("pesan_chat")
        .select("pesan_id, peran, isi, sumber")
        .eq("dokumen_id", docId)
        .order("urutan", { ascending: true });

      if (data) {
        setMessages(
          data.map((row) => ({
            id: String(row.pesan_id),
            role: row.peran === "user" ? "user" : "assistant",
            content: String(row.isi),
            sources: Array.isArray(row.sumber)
              ? (row.sumber as Array<{ potongan_id: string; halaman: number }>)
              : undefined,
          }))
        );
      }
    } catch {
      toast.error("Gagal memuat riwayat percakapan dokumen.");
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const supabase = createClient();
      await supabase.from("dokumen").delete().eq("dokumen_id", docId);
      setDocuments((prev) => prev.filter((item) => item.id !== docId));
      if (activeDocId === docId) {
        setActiveDocId(null);
        setMessages([]);
      }
      toast.success("Dokumen dihapus.");
    } catch {
      toast.error("Gagal menghapus dokumen.");
    }
  };

  const handleSend = async (question: string, file: File | null) => {
    let targetDocId = activeDocId;
    setLoading(true);

    try {
      const supabase = createClient();

      if (file) {
        if (file.type !== "application/pdf") {
          toast.error("Hanya berkas berformat PDF yang didukung.");
          setLoading(false);
          return;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          toast.error("Ukuran berkas PDF melebihi batas 5 MB.");
          setLoading(false);
          return;
        }

        const newDocId = crypto.randomUUID();
        const storagePath = `${userId}/${newDocId}.pdf`;
        const { error: insertErr } = await supabase.from("dokumen").insert({
          dokumen_id: newDocId,
          user_id: userId,
          nama_file: file.name,
          lokasi_file: storagePath,
          ukuran_file: file.size,
          status_proses: "PENDING",
        });

        if (!insertErr) {
          await supabase.storage
            .from("dokumen-pdf")
            .upload(storagePath, file, { contentType: "application/pdf" });
        }

        const newDocItem: SidebarDocumentItem = {
          id: newDocId,
          title: file.name,
          status: "PROCESSING",
        };
        setDocuments((prev) => [newDocItem, ...prev]);
        setActiveDocId(newDocId);
        targetDocId = newDocId;
      }

      const userBubble: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: "user",
        content: question || `Mengunggah materi: ${file?.name ?? "Dokumen.pdf"}`,
        fileName: file?.name,
      };
      setMessages((prev) => [...prev, userBubble]);

      if (!targetDocId) {
        const fallbackBubble: ChatMessageItem = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Silakan unggah berkas PDF materi kuliah terlebih dahulu menggunakan tombol 'Add +' agar PahaMIn dapat menjawab berdasarkan isi dokumen Anda.",
        };
        setMessages((prev) => [...prev, fallbackBubble]);
        return;
      }

      const assistantBubble: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Mode penjelasan (${activeStyle}): Materi "${
          documents.find((d) => d.id === targetDocId)?.title ??
          file?.name ??
          "Dokumen"
        }" siap dianalisis. Silakan ajukan pertanyaan spesifik mengenai bagian materi ini.`,
      };
      setMessages((prev) => [...prev, assistantBubble]);
    } catch {
      toast.error("Terjadi kendala saat memproses permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        documents={documents}
        activeDocId={activeDocId}
        onSelectDoc={(docId) => void handleSelectDoc(docId)}
        onNewSession={() => {
          setActiveDocId(null);
          setMessages([]);
        }}
        onDeleteDoc={(docId) => void handleDeleteDoc(docId)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader userEmail={userEmail} displayName={displayName} />
        <ChatWorkspace
          messages={messages}
          loading={loading}
          activeStyle={activeStyle}
          onChangeStyle={setActiveStyle}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
