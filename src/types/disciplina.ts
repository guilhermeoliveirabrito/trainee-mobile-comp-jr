export type Disciplina = {
  id: string;
  nome: string;
  professor: string | null;
  semestre: string | null;
  cor: string;
  foto_path: string | null;
  criado_em: string;
};

export type DadosDisciplina = {
  nome: string;
  professor: string | null;
  semestre: string | null;
  cor: string;
  foto_path: string | null;
};