"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, GraduationCap, LogOut, Save, TrendingUp, UserRound } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  institution: string;
  major: string;
  semester: string;
  city: string;
  filesUploaded: number;
  tasksCompleted: number;
  streakCount: number;
}

interface ProfileViewProps {
  userId: string;
  initialProfile: ProfileData;
}

export function ProfileView({ userId, initialProfile }: ProfileViewProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileData>(initialProfile);

  const updateField = (key: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.fullName,
          username: form.username,
          phone: form.phone,
          bio: form.bio.slice(0, 120),
          institution: form.institution,
          major: form.major,
          semester: form.semester,
          city: form.city,
        },
      });
      if (error) {
        toast.error("Gagal memperbarui profil pengguna.");
        return;
      }
      await supabase.from("profil_pengguna").upsert({ user_id: userId }, { onConflict: "user_id" });
      toast.success("Profil berhasil disimpan!");
      router.refresh();
    } catch {
      toast.error("Terjadi kendala saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Anda telah keluar dari akun.");
    router.push("/login");
    router.refresh();
  };

  const inputClass = "w-full rounded-xl border border-[#d1d5db] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#111827] outline-none focus:border-[#2563eb] focus:bg-white";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      <AppSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} documents={[]} activeDocId={null} onSelectDoc={() => {}} onNewSession={() => {}} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader userEmail={form.email} displayName={form.fullName || form.username || "Mahasiswa"} />
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Edit Profil</h1>
              <p className="text-sm text-[#6b7280]">Kelola informasi akun dan preferensi belajarmu</p>
            </div>
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] disabled:opacity-60">
              <Save className="h-4 w-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2.5 border-b border-[#f3f4f6] pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-bold text-[#111827]">Identitas</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Nama Lengkap</label>
                    <input type="text" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Username</label>
                    <input type="text" value={form.username} onChange={(e) => updateField("username", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Email</label>
                    <input type="email" value={form.email} disabled className="w-full cursor-not-allowed rounded-xl border border-[#e5e7eb] bg-[#f3f4f6] px-3.5 py-2 text-sm text-[#6b7280]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Nomor Telepon</label>
                    <input type="text" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Bio (Maksimal 120 karakter)</label>
                    <textarea rows={3} maxLength={120} value={form.bio} onChange={(e) => updateField("bio", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between border-b border-[#f3f4f6] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-bold text-[#111827]">Info Akademik</h2>
                  </div>
                  <span className="rounded-full border border-[#e5e7eb] px-2.5 py-0.5 text-[11px] text-[#6b7280]">Opsional</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Institusi / Universitas</label>
                    <input type="text" value={form.institution} onChange={(e) => updateField("institution", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Jurusan / Program Studi</label>
                    <input type="text" value={form.major} onChange={(e) => updateField("major", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Semester / Tingkat</label>
                    <input type="text" value={form.semester} onChange={(e) => updateField("semester", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Kota / Domisili</label>
                    <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
                  <TrendingUp className="h-4 w-4 text-[#2563eb]" />
                  <span>Aktivitas Belajar</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#eff6ff] p-4 text-center">
                    <div className="text-2xl font-bold text-[#2563eb]">{form.filesUploaded}</div>
                    <div className="mt-1 text-[11px] text-[#6b7280]">File diunggah</div>
                  </div>
                  <div className="rounded-2xl bg-[#eff6ff] p-4 text-center">
                    <div className="text-2xl font-bold text-[#2563eb]">{form.tasksCompleted}</div>
                    <div className="mt-1 text-[11px] text-[#6b7280]">Tugas dikerjakan</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
                  <Flame className="h-6 w-6 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">{form.streakCount} streak belajar!</p>
                    <p className="text-[11px] text-amber-700">Pertahankan ritme belajarmu hari ini</p>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => void handleLogout()} className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
