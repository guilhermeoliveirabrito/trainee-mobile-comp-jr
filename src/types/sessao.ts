export type Sessao = {
  id: string;
  disciplina_id: string;
  duracao_minutos: number;
  data_sessao: string;
  observacao: string | null;
  criado_em: string;
  disciplinas: { nome: string; cor: string } | null;
};

export type DadosSessao = {
  disciplina_id: string;
  duracao_minutos: number;
  data_sessao: string;
};