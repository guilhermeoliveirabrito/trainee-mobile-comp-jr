import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { listarSessoes } from '../services/sessoes';
import { Sessao } from '../types/sessao';
import { getErrorMessage } from '../utils/errorMessages';

export function useSessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setErro('');
    try {
      setSessoes(await listarSessoes());
    } catch (e) {
      setErro(getErrorMessage(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar().finally(() => setLoading(false));
    }, [carregar])
  );

  const recarregar = useCallback(async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }, [carregar]);

  return { sessoes, loading, refreshing, erro, recarregar };
}