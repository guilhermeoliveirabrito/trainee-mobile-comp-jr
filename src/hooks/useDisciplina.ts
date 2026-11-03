import { useCallback, useEffect, useState } from 'react';
import { buscarDisciplina } from '../services/disciplinas';
import { Disciplina } from '../types/disciplina';
import { getErrorMessage } from '../utils/errorMessages';

export function useDisciplina(id: string) {
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      setDisciplina(await buscarDisciplina(id));
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { disciplina, loading, erro, recarregar: carregar };
}