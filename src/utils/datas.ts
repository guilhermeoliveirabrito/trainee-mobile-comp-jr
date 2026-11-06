// Usa o dia local, o toISOString viraria o dia à noite por causa do UTC
export function paraIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Monta por ano/mês/dia, new Date('2026-11-05') cairia no dia 4 aqui
export function deIso(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

// Só inverte a string, sem passar por Date
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function hojeIso(): string {
  return paraIso(new Date());
}