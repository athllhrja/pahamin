import assert from "node:assert/strict";

const origin = `http://127.0.0.1:${process.argv[2] || "3000"}`;
for (const path of ["/", "/masuk"]) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy"), /nonce-/);
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
}
for (const path of ["/tugas", "/ruang-paham", "/login"]) {
  const response = await fetch(origin + path, { redirect: "manual" });
  assert.equal(response.status, 307, path);
  assert.equal(new URL(response.headers.get("location"), origin).pathname, "/masuk");
}
for (const path of ["/api/auth/login", "/api/auth/logout", "/api/tasks", "/api/documents"]) {
  const response = await fetch(origin + path, { method: "POST", headers: { Origin: "https://attacker.test" } });
  assert.equal(response.status, 403, path);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).code, "FORBIDDEN");
}
console.log("HTTP smoke: halaman publik, redirect login, dan proteksi endpoint backend lulus.");
