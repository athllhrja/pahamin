begin;

create table public.profil_pengguna (
  user_id uuid primary key references auth.users(id) on delete cascade,
  diperbarui_pada timestamptz not null default now()
);

create table public.tugas (
  tugas_id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  judul varchar(150) not null check (length(btrim(judul)) between 1 and 150 and judul ~ '[^[:space:]]'),
  mendesak boolean not null,
  penting boolean not null,
  selesai boolean not null default false,
  posisi integer not null default 0 check (posisi >= 0),
  dibuat_pada timestamptz not null default now(),
  diperbarui_pada timestamptz not null default now()
);
create index tugas_pemilik on public.tugas(user_id, dibuat_pada);

create table public.dokumen (
  dokumen_id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nama_file varchar(255) not null check (length(btrim(nama_file)) > 0),
  lokasi_file varchar(512) not null unique,
  ukuran_file bigint not null check (ukuran_file between 1 and 5242880),
  status_proses varchar(10) not null default 'PENDING' check (status_proses = 'PENDING'),
  dibuat_pada timestamptz not null default now(),
  check (lokasi_file = user_id::text || '/' || dokumen_id::text || '.pdf')
);
create index dokumen_pemilik on public.dokumen(user_id);

create function public.buat_profil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profil_pengguna(user_id) values (new.id);
  return new;
end;
$$;
revoke all on function public.buat_profil() from public, anon, authenticated;
create trigger saat_akun_dibuat after insert on auth.users for each row execute function public.buat_profil();
insert into public.profil_pengguna(user_id) select id from auth.users on conflict do nothing;

create function public.sesi_aktif() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.sessions
    where id::text = (select auth.jwt()->>'session_id')
      and user_id = (select auth.uid())
      and (not_after is null or not_after > now())
  );
$$;
revoke all on function public.sesi_aktif() from public, anon;
grant execute on function public.sesi_aktif() to authenticated;

alter table public.profil_pengguna enable row level security;
alter table public.tugas enable row level security;
alter table public.dokumen enable row level security;
revoke all on public.profil_pengguna, public.tugas, public.dokumen from public, anon, authenticated;
grant select, update(diperbarui_pada) on public.profil_pengguna to authenticated;
grant select, insert on public.tugas to authenticated;
grant select, insert, delete on public.dokumen to authenticated;

create policy profil_select on public.profil_pengguna for select to authenticated
  using ((select auth.uid()) = user_id and (select public.sesi_aktif()));
create policy profil_update on public.profil_pengguna for update to authenticated
  using ((select auth.uid()) = user_id and (select public.sesi_aktif()))
  with check ((select auth.uid()) = user_id and (select public.sesi_aktif()));
create policy tugas_select on public.tugas for select to authenticated
  using ((select auth.uid()) = user_id and (select public.sesi_aktif()));
create policy tugas_insert on public.tugas for insert to authenticated
  with check ((select auth.uid()) = user_id and (select public.sesi_aktif()));
create policy dokumen_pemilik on public.dokumen for all to authenticated
  using ((select auth.uid()) = user_id and (select public.sesi_aktif()))
  with check ((select auth.uid()) = user_id and (select public.sesi_aktif()));

create function public.periksa_kuota_dokumen() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  update public.profil_pengguna set diperbarui_pada = now() where user_id = new.user_id;
  if not found then raise exception 'AUTH_INVALID' using errcode = '42501'; end if;
  if (select count(*) from public.dokumen where user_id = new.user_id) >= 10 then
    raise exception 'QUOTA_EXCEEDED' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger dokumen_kuota before insert on public.dokumen for each row execute function public.periksa_kuota_dokumen();

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('dokumen-pdf', 'dokumen-pdf', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];

create policy pdf_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'dokumen-pdf' and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.sesi_aktif())
  and exists (select 1 from public.dokumen d where d.lokasi_file = name)
);
create policy pdf_select on storage.objects for select to authenticated using (
  bucket_id = 'dokumen-pdf' and (storage.foldername(name))[1] = (select auth.uid())::text and (select public.sesi_aktif())
);
create policy pdf_delete on storage.objects for delete to authenticated using (
  bucket_id = 'dokumen-pdf' and (storage.foldername(name))[1] = (select auth.uid())::text and (select public.sesi_aktif())
);

create function public.cegah_file_yatim() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if exists (select 1 from storage.objects where bucket_id = 'dokumen-pdf' and name = old.lokasi_file) then
    raise exception 'STORAGE_DELETE_REQUIRED' using errcode = '23514';
  end if;
  return old;
end;
$$;
create trigger dokumen_hapus_file before delete on public.dokumen for each row execute function public.cegah_file_yatim();

commit;
