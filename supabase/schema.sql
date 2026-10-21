-- Mentor: esquema do banco de dados

-- Perfil do usuário (criado automaticamente no cadastro)
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  meta_semanal_horas integer not null default 10
    check (meta_semanal_horas between 1 and 100),
  criado_em timestamptz not null default now()
);

create table public.disciplinas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 80),
  professor text,
  semestre text,
  cor text not null default '#3E8EDE',
  criado_em timestamptz not null default now()
);

create table public.atividades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  disciplina_id uuid not null
    references public.disciplinas (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 120),
  descricao text,
  tipo text not null default 'tarefa'
    check (tipo in ('prova', 'trabalho', 'tarefa', 'leitura')),
  prioridade text not null default 'media'
    check (prioridade in ('baixa', 'media', 'alta')),
  status text not null default 'pendente'
    check (status in ('pendente', 'em_andamento', 'concluida')),
  data_entrega date,
  criado_em timestamptz not null default now()
);

create table public.sessoes_estudo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  disciplina_id uuid not null
    references public.disciplinas (id) on delete cascade,
  duracao_minutos integer not null check (duracao_minutos > 0),
  data_sessao date not null default current_date,
  observacao text,
  criado_em timestamptz not null default now()
);

create index atividades_user_idx on public.atividades (user_id);
create index atividades_disciplina_idx on public.atividades (disciplina_id);
create index disciplinas_user_idx on public.disciplinas (user_id);
create index sessoes_user_idx on public.sessoes_estudo (user_id);
create index sessoes_disciplina_idx on public.sessoes_estudo (disciplina_id);

-- Segurança por linha: cada usuário acessa apenas o que é seu
alter table public.perfis enable row level security;
alter table public.disciplinas enable row level security;
alter table public.atividades enable row level security;
alter table public.sessoes_estudo enable row level security;

create policy "perfil proprio" on public.perfis
  for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "disciplinas proprias" on public.disciplinas
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "atividades proprias" on public.atividades
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.disciplinas d
      where d.id = disciplina_id and d.user_id = (select auth.uid())
    )
  );

create policy "sessoes proprias" on public.sessoes_estudo
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.disciplinas d
      where d.id = disciplina_id and d.user_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.perfis to authenticated;
grant select, insert, update, delete on public.disciplinas to authenticated;
grant select, insert, update, delete on public.atividades to authenticated;
grant select, insert, update, delete on public.sessoes_estudo to authenticated;

-- Cria o perfil automaticamente quando um usuário se cadastra
create function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.perfis (id, nome)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();