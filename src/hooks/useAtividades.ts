import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { listarAtividades } from '../services/atividades';
import { Atividade } from '../types/atividade';
import { getErrorMessage } from '../utils/errorMessages';

export function useAtividades() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setErro('');
    try {
      setAtividades(await listarAtividades());
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

  return { atividades, loading, refreshing, erro, recarregar };
}