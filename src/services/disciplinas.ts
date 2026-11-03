import { Disciplina } from '../types/disciplina';
import { supabase } from './supabase';

export async function listarDisciplinas(): Promise<Disciplina[]> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .select('id, nome, professor, semestre, cor, criado_em')
    .order('nome', { ascending: true });

  if (error) {
    throw Object.assign(new Error(error.message), { code: error.code, status });
  }

  return data ?? [];
}