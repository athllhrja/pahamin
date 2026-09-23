import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Matriks Eisenhower",
    description:
      "Kelola prioritas tugas dalam empat kuadran dengan drag-and-drop yang instan.",
  },
  {
    title: "Ruang Paham",
    description:
      "Unggah PDF dan tanya-jawab interaktif dengan materimu lewat RAG chatbot.",
  },
  {
    title: "Dasbor Belajar",
    description:
      "Pantau rekam jejak belajarmu dengan streak dan statistik dokumen.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-12 px-6 py-20">
      <section className="flex flex-col items-center gap-6 text-center">
        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          PahaMIn
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold text-primary sm:text-5xl">
          Atasi beban mental, kuasai prioritasmu.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed">
          Platform manajemen tugas dan asisten belajar AI untuk mahasiswa,
          menggabungkan Matriks Eisenhower dengan penyederhanaan materi secara
          instan.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/login" />}>
            Masuk
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/register" />}>
            Buat Akun
          </Button>
        </div>
      </section>
      <section className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}