import {
    PrioridadeAtividade,
    StatusAtividade,
    TipoAtividade,
} from '../types/atividade';

type Opcao<T> = { value: T; label: string };

export const TIPOS: Opcao<TipoAtividade>[] = [
  { value: 'tarefa', label: 'Tarefa' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'prova', label: 'Prova' },
  { value: 'leitura', label: 'Leitura' },
];

export const PRIORIDADES: Opcao<PrioridadeAtividade>[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
];

export const STATUS: Opcao<StatusAtividade>[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluída' },
];

export function rotulo<T extends string>(opcoes: Opcao<T>[], valor: T): string {
  return opcoes.find((opcao) => opcao.value === valor)?.label ?? valor;
}