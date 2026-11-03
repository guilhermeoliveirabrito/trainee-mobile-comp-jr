import { Atividade, DadosAtividade, StatusAtividade } from '../types/atividade';
import {
    garantirLista,
    garantirObjeto,
    garantirRegistro,
    lancarErro,
} from './erros';
import { supabase } from './supabase';

const COLUNAS =
  'id, disciplina_id, titulo, descricao, tipo, prioridade, status, data_entrega, criado_em, disciplinas(nome, cor)';

export async function listarAtividades(): Promise<Atividade[]> {
  const { data, error, status } = await supabase
    .from('atividades')
    .select(COLUNAS)
    .order('data_entrega', { ascending: true, nullsFirst: false })
    .order('criado_em', { ascending: false });

  if (error) lancarErro(error, status);

  return garantirLista<Atividade>(data);
}

export async function buscarAtividade(id: string): Promise<Atividade> {
  const { data, error, status } = await supabase
    .from('atividades')
    .select(COLUNAS)
    .eq('id', id)
    .single();

  if (error) lancarErro(error, status);

  return garantirObjeto<Atividade>(data);
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