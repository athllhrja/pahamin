import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatrixView, type MatrixTaskItem } from "@/components/matrix/matrix-view";

export const metadata: Metadata = {
  title: "Matriks Tugas",
};

export default async function MatrixPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <MatrixView
        userId="demo-user"
        userEmail="mahasiswa@pahamin.id"
        displayName="Mahasiswa PahaMIn"
        initialTasks={[]}
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

  let initialTasks: MatrixTaskItem[] = [];
  const { data: rows } = await supabase
    .from("tugas")
    .select("tugas_id, judul, mendesak, penting, selesai")
    .eq("user_id", user.id)
    .order("posisi", { ascending: true });

  if (rows) {
    initialTasks = rows.map((row) => ({
      id: String(row.tugas_id),
      judul: String(row.judul),
      mendesak: Boolean(row.mendesak),
      penting: Boolean(row.penting),
      selesai: Boolean(row.selesai),
    }));
  }

  return (
    <MatrixView
      userId={user.id}
      userEmail={user.email ?? ""}
      displayName={metadataName}
      initialTasks={initialTasks}
    />
  );
}
