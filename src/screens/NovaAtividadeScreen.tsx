import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { AtividadeForm, ValoresAtividade } from '../components/AtividadeForm';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { criarAtividade } from '../services/atividades';
import { colors, spacing } from '../styles/theme';
import { getErrorMessage } from '../utils/errorMessages';

export function NovaAtividadeScreen() {
  const { disciplinas, loading, erro, recarregar } = useDisciplinas();

  async function handleSalvar(valores: ValoresAtividade) {
    try {
      await criarAtividade({
        disciplina_id: valores.disciplina_id,
        titulo: valores.titulo.trim(),
        descricao: valores.descricao.trim() || null,
        tipo: valores.tipo,
        prioridade: valores.prioridade,
        status: valores.status,
        data_entrega: valores.data_entrega,
      });
    } catch (e) {
      return getErrorMessage(e);
    }

    Alert.alert('Atividade cadastrada', 'Ela já aparece na sua lista.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  if (loading) {
    return <LoadingState message="Carregando disciplinas..." />;
  }

  if (erro) {
    return (
      <View style={styles.erro}>
        <FeedbackMessage type="error" text={erro} />
        <Button title="Tentar novamente" variant="outline" onPress={recarregar} />
      </View>
    );
  }

  if (disciplinas.length === 0) {
    return (
      <View style={styles.vazio}>
        <EmptyState
          title="Cadastre uma disciplina primeiro"
          description="Toda atividade pertence a uma disciplina."
          actionLabel="Cadastrar disciplina"
          onAction={() => router.push('/disciplina/nova')}
        />
      </View>
    );
  }

  return (
    <AtividadeForm
      disciplinas={disciplinas}
      submitLabel="Cadastrar"
      onSubmit={handleSalvar}
    />
  );
}

const styles = StyleSheet.create({
  erro: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  vazio: {
    flex: 1,
    backgroundColor: colors.background,
  },
});