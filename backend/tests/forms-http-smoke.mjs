import assert from "node:assert/strict";

const origin = `http://127.0.0.1:${process.argv[2] || "3000"}`;
const cases = [
  { path: "/api/auth/login", status: 422, code: "VALIDATION_ERROR", body: { email: "invalid", password: "short" } },
  { path: "/api/auth/login", status: 403, code: "FORBIDDEN", origin: "https://attacker.test", body: {} },
  { path: "/api/tasks", status: 401, code: "AUTH_INVALID", method: "GET" },
  { path: "/api/tasks", status: 401, code: "AUTH_INVALID", body: { judul: "Test", penting: true, mendesak: false } },
  { path: "/api/auth/logout", status: 401, code: "AUTH_INVALID", body: {} },
];

for (const scenario of cases) {
  const response = await fetch(origin + scenario.path, {
    method: scenario.method || "POST",
    headers: { Origin: scenario.origin || origin, "Content-Type": "application/json" },
    ...(scenario.body ? { body: JSON.stringify(scenario.body) } : {}),
  });
  assert.equal(response.status, scenario.status, scenario.path);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).code, scenario.code);
  console.log(`${scenario.path}: ${scenario.status} ${scenario.code}`);
}
