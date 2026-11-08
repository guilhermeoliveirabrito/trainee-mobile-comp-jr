import { DadosDisciplina, Disciplina } from '../types/disciplina';
import {
  garantirLista,
  garantirObjeto,
  garantirRegistro,
  lancarErro,
} from './erros';
import { supabase } from './supabase';

const COLUNAS = 'id, nome, professor, semestre, cor, foto_path, criado_em';

export async function listarDisciplinas(): Promise<Disciplina[]> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .select(COLUNAS)
    .order('nome', { ascending: true });

  if (error) lancarErro(error, status);

  return garantirLista<Disciplina>(data);
}

export async function buscarDisciplina(id: string): Promise<Disciplina> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .select(COLUNAS)
    .eq('id', id)
    .single();

  if (error) lancarErro(error, status);

  return garantirObjeto<Disciplina>(data);
}

export async function criarDisciplina(dados: DadosDisciplina): Promise<Disciplina> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .insert(dados)
    .select(COLUNAS)
    .single();

  if (error) lancarErro(error, status);

  return garantirObjeto<Disciplina>(data);
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

  return garantirObjeto<Disciplina>(data);
}

export async function excluirDisciplina(id: string): Promise<void> {
  const { data, error, status } = await supabase
    .from('disciplinas')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) lancarErro(error, status);

  garantirRegistro(data);
}