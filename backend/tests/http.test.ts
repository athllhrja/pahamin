import assert from "node:assert/strict";
import test from "node:test";
import { loginHandler, logoutHandler } from "../controllers/auth";
import { createTaskHandler, listTasksHandler } from "../controllers/tasks";
import { uploadDocumentHandler } from "../controllers/documents";
import { readBody } from "../http/body";
import type { BackendClient } from "../types/client";

const origin = "http://127.0.0.1:3000";
const userId = "33333333-3333-4333-8333-333333333333";

function jsonRequest(path: string, data: unknown, requestOrigin = origin) {
  return new Request(origin + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: requestOrigin },
    body: JSON.stringify(data),
  });
}

function clientMock(overrides: Record<string, unknown> = {}) {
  return {
    auth: { getUser: async () => ({ data: { user: { id: userId } }, error: null }) },
    rpc: async () => ({ data: true, error: null }),
    ...overrides,
  } as unknown as BackendClient;
}

test("login returns user without exposing access or refresh tokens", async () => {
  const client = clientMock({ auth: {
    signInWithPassword: async (input: unknown) => {
      assert.deepEqual(input, { email: "student@example.com", password: "password123" });
      return { data: { user: { id: userId, email: "student@example.com" }, session: { access_token: "private", refresh_token: "private" } }, error: null };
    },
  } });
  const response = await loginHandler(jsonRequest("/api/auth/login", { email: "student@example.com", password: "password123" }), async () => client);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body.data, { id: userId, email: "student@example.com" });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok(body.request_id);
});

test("wrong credentials produce a generic login failure", async () => {
  const client = clientMock({ auth: { signInWithPassword: async () => ({ data: {}, error: { status: 400 } }) } });
  const response = await loginHandler(jsonRequest("/api/auth/login", { email: "unknown@example.com", password: "password123" }), async () => client);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).code, "LOGIN_FAILED");
});

test("cross-origin mutation is rejected before opening a session", async () => {
  let called = false;
  const response = await loginHandler(jsonRequest("/api/auth/login", {}, "https://attacker.test"), async () => { called = true; return clientMock(); });
  assert.equal(response.status, 403);
  assert.equal(called, false);
});

test("invalid login input is rejected by server validation", async () => {
  const response = await loginHandler(jsonRequest("/api/auth/login", { email: "bad", password: "short" }), async () => clientMock());
  assert.equal(response.status, 422);
});

test("task creation uses session owner and persists quadrant flags", async () => {
  const input = { judul: "  Belajar  ", mendesak: true, penting: false };
  let inserted: unknown;
  const client = clientMock({ from: (table: string) => {
    assert.equal(table, "tugas");
    return { insert: (value: unknown) => {
      inserted = value;
      return { select: () => ({ single: async () => ({ data: value, error: null }) }) };
    } };
  } });
  const response = await createTaskHandler(jsonRequest("/api/tasks", input), async () => client);
  assert.equal(response.status, 201);
  assert.deepEqual(inserted, { judul: "Belajar", mendesak: true, penting: false, user_id: userId });
});

test("request cannot supply another user as task owner", async () => {
  const response = await createTaskHandler(jsonRequest("/api/tasks", { judul: "Task", mendesak: true, penting: true, user_id: "another-user" }), async () => clientMock());
  assert.equal(response.status, 422);
});

test("list tasks rejects revoked session", async () => {
  const client = clientMock({ rpc: async () => ({ data: false, error: null }) });
  const response = await listTasksHandler(new Request(origin + "/api/tasks"), async () => client);
  assert.equal(response.status, 401);
});

test("logout revokes Supabase sessions globally", async () => {
  let signedOut = false;
  const client = clientMock({ auth: {
    getUser: async () => ({ data: { user: { id: userId } }, error: null }),
    signOut: async (options: unknown) => {
      assert.deepEqual(options, { scope: "global" });
      signedOut = true;
      return { error: null };
    },
  } });
  const response = await logoutHandler(jsonRequest("/api/auth/logout", {}), async () => client);
  assert.equal(response.status, 200);
  assert.equal(signedOut, true);
});

test("fake PDF is rejected by upload endpoint before Storage access", async () => {
  const form = new FormData();
  form.append("file", new File(["MZ executable"], "materi.pdf", { type: "application/pdf" }));
  const response = await uploadDocumentHandler(new Request(origin + "/api/documents", { method: "POST", headers: { Origin: origin }, body: form }), async () => clientMock());
  assert.equal(response.status, 422);
  assert.equal((await response.json()).code, "INVALID_PDF");
});

test("stream limit works without trusting Content-Length", async () => {
  const request = new Request(origin, { method: "POST", body: "1234567890" });
  await assert.rejects(readBody(request, 5), { code: "PAYLOAD_TOO_LARGE" });
});
