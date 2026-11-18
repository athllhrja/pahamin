begin;

alter table public.dokumen add column if not exists diunggah_pada timestamptz;
grant update(diunggah_pada) on public.dokumen to authenticated;

create function public.periksa_bukti_unggah() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.diunggah_pada is not null and not exists (
    select 1 from storage.objects where bucket_id = 'dokumen-pdf' and name = new.lokasi_file
  ) then
    raise exception 'UPLOAD_NOT_COMPLETE' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger dokumen_bukti_unggah before insert or update of diunggah_pada on public.dokumen
  for each row execute function public.periksa_bukti_unggah();

commit;
