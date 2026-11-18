import { test, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const DOCUMENT_ID = "33333333-3333-4333-8333-333333333333";
let database: PGlite;

async function asUser(userId = USER_A) {
  await database.exec("set role authenticated");
  await database.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify({ sub: userId, session_id: userId })]);
}
async function createDocument(id = DOCUMENT_ID) {
  await database.query("insert into public.dokumen(dokumen_id,nama_file,lokasi_file,ukuran_file) values ($1::uuid,'materi.pdf',auth.uid()::text || '/' || $1::uuid::text || '.pdf',100)", [id]);
}

before(async () => {
  database = new PGlite();
  await database.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create schema storage;
    create table auth.users(id uuid primary key);
    create table auth.sessions(id uuid primary key, user_id uuid references auth.users(id), not_after timestamptz);
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
    create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1, '/') $$;
    alter table storage.objects enable row level security;
    grant usage on schema auth, storage, public to authenticated, anon;
    grant select, insert, delete on storage.objects to authenticated;
  `);
  for (const filename of (await readdir("supabase/migrations")).sort()) {
    await database.exec(await readFile(path.join("supabase/migrations", filename), "utf8"));
  }
  await database.query("insert into auth.users(id) values ($1),($2)", [USER_A, USER_B]);
  await database.query("insert into auth.sessions(id,user_id) values ($1,$1),($2,$2)", [USER_A, USER_B]);
});
after(async () => { await database?.close(); });
beforeEach(async () => { await database.exec("begin"); await asUser(); });
afterEach(async () => { await database.exec("rollback; reset role"); });

test("minimal schema has three protected tables and no vector extension", async () => {
  const tables = await database.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where relnamespace='public'::regnamespace and relkind='r'");
  assert.equal(tables.rows.length, 3);
  assert.ok(tables.rows.every((row) => row.relrowsecurity));
  assert.equal((await database.query("select * from pg_extension where extname='vector'")).rows.length, 0);
});
test("new account receives a profile for the quota lock", async () => {
  assert.equal((await database.query("select * from public.profil_pengguna")).rows.length, 1);
});
test("task create persists validated title and quadrant attributes", async () => {
  await database.query("insert into public.tugas(judul,mendesak,penting) values ('Belajar',false,true)");
  const tasks = await database.query<{ judul: string; mendesak: boolean; penting: boolean }>("select * from public.tugas");
  assert.equal(tasks.rows[0].judul, "Belajar");
  assert.equal(tasks.rows[0].mendesak, false);
  assert.equal(tasks.rows[0].penting, true);
});
test("database rejects whitespace-only task title", async () => {
  await assert.rejects(database.query("insert into public.tugas(judul,mendesak,penting) values ('   ',true,true)"));
});
test("quota permits ten documents and rejects the eleventh", async () => {
  for (let index = 0; index < 10; index++) await createDocument(crypto.randomUUID());
  await assert.rejects(createDocument(crypto.randomUUID()), /QUOTA_EXCEEDED/);
});
test("receipt cannot claim success without a stored object", async () => {
  await createDocument();
  await assert.rejects(database.query("update public.dokumen set diunggah_pada=now()"), /UPLOAD_NOT_COMPLETE/);
});
test("stored PDF receives receipt and remains PENDING without AI", async () => {
  await createDocument();
  await database.query("insert into storage.objects(bucket_id,name) values ('dokumen-pdf',$1)", [USER_A + "/" + DOCUMENT_ID + ".pdf"]);
  await database.query("update public.dokumen set diunggah_pada=now()");
  const result = await database.query<{ status_proses: string; diunggah_pada: string }>("select * from public.dokumen");
  assert.equal(result.rows[0].status_proses, "PENDING");
  assert.ok(result.rows[0].diunggah_pada);
});
test("account B cannot read account A tasks, metadata or file", async () => {
  await createDocument();
  await database.query("insert into public.tugas(judul,mendesak,penting) values ('Rahasia',true,true)");
  await database.query("insert into storage.objects(bucket_id,name) values ('dokumen-pdf',$1)", [USER_A + "/" + DOCUMENT_ID + ".pdf"]);
  await asUser(USER_B);
  for (const table of ["public.tugas", "public.dokumen", "storage.objects"]) {
    assert.equal((await database.query("select * from " + table)).rows.length, 0);
  }
  assert.equal((await database.query("delete from public.dokumen returning *")).rows.length, 0);
  assert.equal((await database.query("delete from storage.objects returning *")).rows.length, 0);
  await assert.rejects(database.query("insert into public.tugas(user_id,judul,mendesak,penting) values ($1,'Palsu',true,true)", [USER_A]));
});
test("Storage rejects uploads without metadata", async () => {
  await assert.rejects(database.query("insert into storage.objects(bucket_id,name) values ('dokumen-pdf',$1)", [USER_A + "/" + DOCUMENT_ID + ".pdf"]));
});
test("metadata cannot be deleted before the file", async () => {
  await createDocument();
  await database.query("insert into storage.objects(bucket_id,name) values ('dokumen-pdf',$1)", [USER_A + "/" + DOCUMENT_ID + ".pdf"]);
  await assert.rejects(database.query("delete from public.dokumen"), /STORAGE_DELETE_REQUIRED/);
});
test("revoked session no longer reads stored tasks", async () => {
  await database.query("insert into public.tugas(judul,mendesak,penting) values ('Belajar',true,true)");
  await database.exec("reset role");
  await database.query("delete from auth.sessions where id=$1", [USER_A]);
  await asUser();
  assert.equal((await database.query("select * from public.tugas")).rows.length, 0);
});
test("anonymous access is denied", async () => {
  await database.exec("reset role; set role anon");
  await assert.rejects(database.query("select * from public.tugas"), /permission denied/);
});
