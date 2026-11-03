import { Atividade, DadosAtividade } from '../types/atividade';
import { supabase } from './supabase';

const COLUNAS =
  'id, disciplina_id, titulo, descricao, tipo, prioridade, status, data_entrega, criado_em, disciplinas(nome, cor)';

function lancarErro(error: { message: string; code?: string }, status: number): never {
  throw Object.assign(new Error(error.message), { code: error.code, status });
}

export async function listarAtividades(): Promise<Atividade[]> {
  const { data, error, status } = await supabase
    .from('atividades')
    .select(COLUNAS)
    .order('data_entrega', { ascending: true, nullsFirst: false })
    .order('criado_em', { ascending: false });

  if (error) lancarErro(error, status);

  return (data ?? []) as unknown as Atividade[];
}

export async function criarAtividade(dados: DadosAtividade): Promise<void> {
  const { error, status } = await supabase.from('atividades').insert(dados);

  if (error) lancarErro(error, status);
}