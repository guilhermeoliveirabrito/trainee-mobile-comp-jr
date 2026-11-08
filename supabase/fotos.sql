-- Foto de capa das disciplinas

alter table public.disciplinas
  add column if not exists foto_path text;

-- Bucket público: a foto abre pelo link, mas só o dono envia ou apaga
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'capas',
  'capas',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "capas: ver as proprias" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'capas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "capas: enviar nas proprias pastas" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'capas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "capas: apagar as proprias" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'capas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );