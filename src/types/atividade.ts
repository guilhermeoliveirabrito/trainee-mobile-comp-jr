export type TipoAtividade = 'prova' | 'trabalho' | 'tarefa' | 'leitura';
export type PrioridadeAtividade = 'baixa' | 'media' | 'alta';
export type StatusAtividade = 'pendente' | 'em_andamento' | 'concluida';

export type Atividade = {
  id: string;
  disciplina_id: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoAtividade;
  prioridade: PrioridadeAtividade;
  status: StatusAtividade;
  data_entrega: string | null;
  criado_em: string;
  disciplinas: { nome: string; cor: string } | null;
};

export type DadosAtividade = {
  disciplina_id: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoAtividade;
  prioridade: PrioridadeAtividade;
  status: StatusAtividade;
  data_entrega: string | null;
};