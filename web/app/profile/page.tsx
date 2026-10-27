import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileView, type ProfileData } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Profil Pengguna",
};

export default async function ProfilePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <ProfileView
        userId="demo-user"
        initialProfile={{
          fullName: "Mahasiswa PahaMIn",
          username: "mahasiswa",
          email: "mahasiswa@pahamin.id",
          phone: "",
          bio: "",
          institution: "",
          major: "Informatika",
          semester: "",
          city: "",
          filesUploaded: 0,
          tasksCompleted: 0,
          streakCount: 0,
        }}
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

  const meta = user.user_metadata ?? {};
  const { count: filesCount } = await supabase
    .from("dokumen")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: tasksCount } = await supabase
    .from("tugas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("selesai", true);

  const { data: profileRow } = await supabase
    .from("profil_pengguna")
    .select("streak_belajar")
    .eq("user_id", user.id)
    .maybeSingle();

  const initialProfile: ProfileData = {
    fullName: typeof meta.full_name === "string" ? meta.full_name : "",
    username:
      typeof meta.username === "string"
        ? meta.username
        : (user.email?.split("@")[0] ?? ""),
    email: user.email ?? "",
    phone: typeof meta.phone === "string" ? meta.phone : "",
    bio: typeof meta.bio === "string" ? meta.bio : "",
    institution: typeof meta.institution === "string" ? meta.institution : "",
    major: typeof meta.major === "string" ? meta.major : "",
    semester: typeof meta.semester === "string" ? meta.semester : "",
    city: typeof meta.city === "string" ? meta.city : "",
    filesUploaded: filesCount ?? 0,
    tasksCompleted: tasksCount ?? 0,
    streakCount:
      typeof profileRow?.streak_belajar === "number"
        ? profileRow.streak_belajar
        : 0,
  };

  return <ProfileView userId={user.id} initialProfile={initialProfile} />;
}
