import { Atividade, DadosAtividade, StatusAtividade } from '../types/atividade';
import { supabase } from './supabase';

const COLUNAS =
  'id, disciplina_id, titulo, descricao, tipo, prioridade, status, data_entrega, criado_em, disciplinas(nome, cor)';

function lancarErro(error: { message: string; code?: string }, status: number): never {
  throw Object.assign(new Error(error.message), { code: error.code, status });
}

function garantirRegistro(data: unknown[] | null) {
  if (!data || data.length === 0) {
    throw Object.assign(new Error('Registro não encontrado'), {
      code: 'PGRST116',
      status: 404,
    });
  }
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

export async function buscarAtividade(id: string): Promise<Atividade> {
  const { data, error, status } = await supabase
    .from('atividades')
    .select(COLUNAS)
    .eq('id', id)
    .single();

  if (error) lancarErro(error, status);

  return data as unknown as Atividade;
}

export async function criarAtividade(dados: DadosAtividade): Promise<void> {
  const { error, status } = await supabase.from('atividades').insert(dados);

  if (error) lancarErro(error, status);
}

export async function atualizarAtividade(id: string, dados: DadosAtividade): Promise<void> {
  const { data, error, status } = await supabase
    .from('atividades')
    .update(dados)
    .eq('id', id)
    .select('id');

  if (error) lancarErro(error, status);

  garantirRegistro(data);
}

export async function atualizarStatusAtividade(
  id: string,
  novoStatus: StatusAtividade
): Promise<void> {
  const { data, error, status } = await supabase
    .from('atividades')
    .update({ status: novoStatus })
    .eq('id', id)
    .select('id');

  if (error) lancarErro(error, status);

  garantirRegistro(data);
}

export async function excluirAtividade(id: string): Promise<void> {
  const { data, error, status } = await supabase
    .from('atividades')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) lancarErro(error, status);

  garantirRegistro(data);
}