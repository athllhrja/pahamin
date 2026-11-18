import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { AppError, asAppError } from "../errors";

export async function requireUser(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();
  if (error) throw new AppError(error.status && error.status >= 500 ? "UPSTREAM_UNAVAILABLE" : "AUTH_INVALID", error.status && error.status >= 500 ? 503 : 401);
  if (!data.user) throw new AppError("AUTH_INVALID", 401);
  const { data: active, error: sessionError } = await client.rpc("sesi_aktif");
  if (sessionError) throw asAppError(sessionError);
  if (!active) throw new AppError("AUTH_INVALID", 401);
  return data.user;
}
