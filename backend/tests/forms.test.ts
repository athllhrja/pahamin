import { test } from "node:test";
import assert from "node:assert/strict";
import { authSchema, taskSchema, uploadSchema } from "../schemas";
import { runUpload } from "../services/upload-workflow";
import { requireUser } from "../supabase/session";
import { AppError } from "../errors";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

test("login validates email and minimum eight-character password", () => {
  assert.equal(authSchema.safeParse({ email: "test@example.com", password: "12345678" }).success, true);
  assert.equal(authSchema.safeParse({ email: "invalid", password: "12345678" }).success, false);
  assert.equal(authSchema.safeParse({ email: "test@example.com", password: "short" }).success, false);
});
test("task title must be nonblank and at most 150 characters", () => {
  for (const judul of [" ", "\t", "x".repeat(151)]) {
    assert.equal(taskSchema.safeParse({ judul, mendesak: true, penting: true }).success, false);
  }
  assert.deepEqual(taskSchema.parse({ judul: " Belajar ", mendesak: false, penting: true }),
    { judul: "Belajar", mendesak: false, penting: true });
});
test("upload validates PDF name, type, nonempty contents and size boundary", () => {
  const valid = new File([new Uint8Array(5242880)], "materi.pdf", { type: "application/pdf" });
  assert.equal(uploadSchema.safeParse({ file: valid }).success, true);
  for (const file of [
    new File([], "materi.pdf", { type: "application/pdf" }),
    new File(["x"], "materi.zip", { type: "application/pdf" }),
    new File(["x"], "materi.pdf", { type: "application/zip" }),
    new File([new Uint8Array(5242881)], "materi.pdf", { type: "application/pdf" }),
  ]) assert.equal(uploadSchema.safeParse({ file }).success, false);
  assert.equal(uploadSchema.safeParse({}).success, false);
});
test("successful upload persists without any AI step", async () => {
  const calls: string[] = [];
  const result = await runUpload({
    reserve: async () => { calls.push("metadata"); return { id: "doc", uploaded: false }; },
    upload: async () => { calls.push("storage"); },
    confirm: async (document) => { calls.push("confirm"); return { ...document, uploaded: true }; },
    cleanup: async () => { calls.push("cleanup"); },
  });
  assert.deepEqual(calls, ["metadata", "storage", "confirm"]);
  assert.equal(result.uploaded, true);
});
test("quota failure prevents Storage upload", async () => {
  let uploaded = false;
  await assert.rejects(runUpload({
    reserve: async () => { throw new AppError("QUOTA_EXCEEDED", 429); },
    upload: async () => { uploaded = true; },
    confirm: async (document) => document,
    cleanup: async () => {},
  }), { code: "QUOTA_EXCEEDED" });
  assert.equal(uploaded, false);
});
test("Storage or receipt failure performs cleanup instead of reporting success", async () => {
  for (const failure of ["upload", "confirm"]) {
    let cleaned = false;
    await assert.rejects(runUpload({
      reserve: async () => "document",
      upload: async () => { if (failure === "upload") throw new Error("storage"); },
      confirm: async () => { throw new Error("receipt"); },
      cleanup: async () => { cleaned = true; },
    }));
    assert.equal(cleaned, true);
  }
});
test("failed cleanup is explicitly reported", async () => {
  await assert.rejects(runUpload({
    reserve: async () => "document",
    upload: async () => { throw new Error("storage"); },
    confirm: async (document) => document,
    cleanup: async () => { throw new Error("cleanup"); },
  }), { code: "CLEANUP_REQUIRED" });
});
test("server rejects missing and revoked sessions", async () => {
  const client = (user: unknown, active: boolean) => ({
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    rpc: async () => ({ data: active, error: null }),
  }) as unknown as SupabaseClient<Database>;
  await assert.rejects(requireUser(client(null, false)), { code: "AUTH_INVALID" });
  await assert.rejects(requireUser(client({ id: "user" }, false)), { code: "AUTH_INVALID" });
  assert.equal((await requireUser(client({ id: "user" }, true))).id, "user");
});
