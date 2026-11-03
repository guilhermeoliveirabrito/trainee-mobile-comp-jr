import { useCallback, useEffect, useState } from 'react';
import { buscarAtividade } from '../services/atividades';
import { Atividade } from '../types/atividade';
import { getErrorMessage } from '../utils/errorMessages';

export function useAtividade(id: string) {
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      setAtividade(await buscarAtividade(id));
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { atividade, loading, erro, recarregar: carregar };
}