import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { Database } from "../types/database";
import { getPublicConfig } from "../config";
import { supabaseFetch } from "./fetch";

export function createBackendClient(cookies: CookieMethodsServer) {
  const { url, key } = getPublicConfig();
  return createServerClient<Database>(url, key, {
    cookieOptions: { sameSite: "lax", path: "/", httpOnly: true },
    global: { fetch: supabaseFetch },
    cookies,
  });
}
