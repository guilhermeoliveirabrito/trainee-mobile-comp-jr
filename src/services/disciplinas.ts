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

export async function criarDisciplina(dados: DadosDisciplina): Promise<Disciplina> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .insert(dados)
    .select(COLUNAS)
    .single();

  if (error) lancarErro(error, status);

  return data as Disciplina;
}