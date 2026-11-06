import { DadosSessao, Sessao } from '../types/sessao';
import { garantirLista, lancarErro } from './erros';
import { supabase } from './supabase';

const COLUNAS =
  'id, disciplina_id, duracao_minutos, data_sessao, observacao, criado_em, disciplinas(nome, cor)';

export async function listarSessoes(): Promise<Sessao[]> {
  const { data, error, status } = await supabase
    .from('sessoes_estudo')
    .select(COLUNAS)
    .order('data_sessao', { ascending: false })
    .order('criado_em', { ascending: false })
    .limit(100);

  if (error) lancarErro(error, status);

  return garantirLista<Sessao>(data);
}

export async function criarSessao(dados: DadosSessao): Promise<void> {
  const { error, status } = await supabase.from('sessoes_estudo').insert(dados);

  if (error) lancarErro(error, status);
}