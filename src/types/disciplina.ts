export type Disciplina = {
  id: string;
  nome: string;
  professor: string | null;
  semestre: string | null;
  cor: string;
  criado_em: string;
};

export type DadosDisciplina = {
  nome: string;
  professor: string | null;
  semestre: string | null;
  cor: string;
};