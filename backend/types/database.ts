export type TaskRow = {
  tugas_id: string;
  user_id: string;
  judul: string;
  mendesak: boolean;
  penting: boolean;
  selesai: boolean;
  posisi: number;
  dibuat_pada: string;
  diperbarui_pada: string;
};
export type DocumentRow = {
  dokumen_id: string;
  user_id: string;
  nama_file: string;
  lokasi_file: string;
  ukuran_file: number;
  diunggah_pada: string | null;
  status_proses: "PENDING" | "PROCESSING" | "READY" | "FAILED";
  dibuat_pada: string;
};
type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};
export type Database = {
  public: {
    Tables: {
      tugas: Table<TaskRow, "judul" | "mendesak" | "penting">;
      dokumen: Table<DocumentRow, "dokumen_id" | "nama_file" | "lokasi_file" | "ukuran_file">;
    };
    Views: Record<string, never>;
    Functions: {
      sesi_aktif: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
