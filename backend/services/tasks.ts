import type { BackendClient } from "../types/client";
import { requireUser } from "../supabase/session";
import { taskSchema, type TaskInput } from "../schemas";
import { asAppError } from "../errors";

export async function listTasks(client: BackendClient) {
  const user = await requireUser(client);
  const { data, error } = await client.from("tugas").select("*")
    .eq("user_id", user.id).order("dibuat_pada").order("tugas_id");
  if (error) throw asAppError(error);
  return data;
}

export async function createTask(client: BackendClient, input: TaskInput) {
  const value = taskSchema.parse(input);
  const user = await requireUser(client);
  const { data, error } = await client.from("tugas")
    .insert({ ...value, user_id: user.id }).select().single();
  if (error) throw asAppError(error);
  return data;
}
