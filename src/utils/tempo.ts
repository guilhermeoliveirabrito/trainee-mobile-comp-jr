import { paraIso } from './datas';

export function formatarTempo(totalSegundos: number): string {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

export function formatarDuracao(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  if (horas === 0) return `${minutos} min`;
  if (minutos === 0) return `${horas} h`;
  return `${horas} h ${minutos} min`;
}

export function inicioDaSemanaIso(): string {
  const hoje = new Date();
  const diasDesdeSegunda = (hoje.getDay() + 6) % 7;
  const segunda = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() - diasDesdeSegunda
  );
  return paraIso(segunda);
}