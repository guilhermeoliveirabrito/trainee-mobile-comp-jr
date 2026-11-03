import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { listarDisciplinas } from '../services/disciplinas';
import { Disciplina } from '../types/disciplina';
import { getErrorMessage } from '../utils/errorMessages';

export function useDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setErro('');
    try {
      setDisciplinas(await listarDisciplinas());
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

  return { disciplinas, loading, refreshing, erro, recarregar };
}