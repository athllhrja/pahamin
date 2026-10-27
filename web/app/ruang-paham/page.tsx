import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RuangPahamView } from "@/components/ruang-paham/ruang-paham-view";
import type { SidebarDocumentItem } from "@/components/layout/app-sidebar";

export const metadata: Metadata = {
  title: "Ruang Paham",
};

export default async function RuangPahamPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <RuangPahamView
        userId="demo-user"
        userEmail="mahasiswa@pahamin.id"
        displayName="Mahasiswa PahaMIn"
        initialDocuments={[]}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.username === "string"
        ? user.user_metadata.username
        : (user.email?.split("@")[0] ?? "Mahasiswa");

  let initialDocuments: SidebarDocumentItem[] = [];
  const { data: docs } = await supabase
    .from("dokumen")
    .select("dokumen_id, nama_file, status_proses")
    .eq("user_id", user.id)
    .order("dibuat_pada", { ascending: false });

  if (docs) {
    initialDocuments = docs.map((row) => ({
      id: String(row.dokumen_id),
      title: String(row.nama_file),
      status: String(row.status_proses),
    }));
  }

  return (
    <RuangPahamView
      userId={user.id}
      userEmail={user.email ?? ""}
      displayName={metadataName}
      initialDocuments={initialDocuments}
    />
  );
}
