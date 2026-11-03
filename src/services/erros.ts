type ErroSupabase = {
  message: string;
  code?: string;
};

export function lancarErro(error: ErroSupabase, status: number): never {
  throw Object.assign(new Error(error.message), { code: error.code, status });
}

export function respostaInvalida(): never {
  throw Object.assign(new Error('Resposta inesperada do servidor'), {
    code: 'resposta_invalida',
  });
}

export function garantirLista<T>(data: unknown): T[] {
  if (!Array.isArray(data)) respostaInvalida();
  return data as T[];
}

export function garantirObjeto<T>(data: unknown): T {
  if (!data || typeof data !== 'object' || Array.isArray(data)) respostaInvalida();
  return data as T;
}

export function garantirRegistro(data: unknown[] | null): void {
  if (!data || data.length === 0) {
    throw Object.assign(new Error('Registro não encontrado'), {
      code: 'PGRST116',
      status: 404,
    });
  }
}