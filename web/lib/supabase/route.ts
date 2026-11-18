import "server-only";
import { cookies } from "next/headers";
import { createBackendClient } from "../../../backend/supabase/server";

export async function createRouteClient() {
  const cookieStore = await cookies();
  return createBackendClient({
    getAll: () => cookieStore.getAll(),
    setAll: (values) => {
      values.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, options);
      });
    },
  });
}
