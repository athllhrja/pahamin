import { SUPABASE_TIMEOUT_MS } from "../config";
export const supabaseFetch: typeof fetch = (input, init) => {
  const timeout = AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return fetch(input, { ...init, signal, cache: "no-store" });
};
