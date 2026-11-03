import { DadosDisciplina, Disciplina } from '../types/disciplina';
import { supabase } from './supabase';

const COLUNAS = 'id, nome, professor, semestre, cor, criado_em';

function lancarErro(error: { message: string; code?: string }, status: number): never {
  throw Object.assign(new Error(error.message), { code: error.code, status });
}

export async function listarDisciplinas(): Promise<Disciplina[]> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .select(COLUNAS)
    .order('nome', { ascending: true });

  if (error) lancarErro(error, status);

  return data ?? [];
}

export async function buscarDisciplina(id: string): Promise<Disciplina> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .select(COLUNAS)
    .eq('id', id)
    .single();

  if (error) lancarErro(error, status);

  return data as Disciplina;
}

export async function criarDisciplina(dados: DadosDisciplina): Promise<Disciplina> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .insert(dados)
    .select(COLUNAS)
    .single();

  if (error) lancarErro(error, status);

  return data as Disciplina;
}

export async function atualizarDisciplina(
  id: string,
  dados: DadosDisciplina
): Promise<Disciplina> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .update(dados)
    .eq('id', id)
    .select(COLUNAS)
    .single();

  if (error) lancarErro(error, status);

  return data as Disciplina;
}

export async function excluirDisciplina(id: string): Promise<void> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) lancarErro(error, status);

  if (!data || data.length === 0) {
    throw Object.assign(new Error('Registro não encontrado'), {
      code: 'PGRST116',
      status: 404,
    });
  }
}