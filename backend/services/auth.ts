import type { BackendClient } from "../types/client";
import { authSchema, type AuthInput } from "../schemas";
import { AppError } from "../errors";

export async function login(client: BackendClient, input: AuthInput) {
  const value = authSchema.parse(input);
  const { data, error } = await client.auth.signInWithPassword(value);
  if (error) {
    if (error.status && error.status >= 500) throw new AppError("UPSTREAM_UNAVAILABLE", 503);
    throw new AppError("LOGIN_FAILED", 401);
  }
  if (!data.session) throw new AppError("LOGIN_FAILED", 401);
  return data.user;
}

export async function logout(client: BackendClient) {
  const { error } = await client.auth.signOut({ scope: "global" });
  if (error) throw new AppError("UPSTREAM_UNAVAILABLE", 503);
}
