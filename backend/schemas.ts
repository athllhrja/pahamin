import { z } from "zod";
import { MAX_UPLOAD_BYTES } from "./config";

export const authSchema = z.strictObject({
  email: z.email("Alamat email tidak valid.").max(254),
  password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(128),
});

export const taskSchema = z.strictObject({
  judul: z.string().trim().min(1, "Judul wajib diisi.").max(150, "Judul maksimal 150 karakter."),
  mendesak: z.boolean(),
  penting: z.boolean(),
});

export const uploadSchema = z.strictObject({
  file: z.instanceof(File, { message: "Pilih PDF terlebih dahulu." })
    .refine((file) => file.size > 0, "Berkas tidak boleh kosong.")
    .refine((file) => file.size <= MAX_UPLOAD_BYTES, "Ukuran PDF maksimal 5 MB.")
    .refine((file) => file.type === "application/pdf" && file.name.toLowerCase().endsWith(".pdf"), "Pilih berkas PDF.")
    .refine((file) => file.name.length <= 255, "Nama berkas maksimal 255 karakter."),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type AuthInput = z.infer<typeof authSchema>;
export type UploadInput = z.infer<typeof uploadSchema>;
