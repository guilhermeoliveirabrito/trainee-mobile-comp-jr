import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { AtividadeForm, ValoresAtividade } from '../components/AtividadeForm';
import { Button } from '../components/Button';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { useAtividade } from '../hooks/useAtividade';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { atualizarAtividade, excluirAtividade } from '../services/atividades';
import { colors, fontSize, spacing } from '../styles/theme';
import { getErrorMessage } from '../utils/errorMessages';

export function EditarAtividadeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dadosAtividade = useAtividade(id);
  const dadosDisciplinas = useDisciplinas();

  const { atividade } = dadosAtividade;
  const { disciplinas } = dadosDisciplinas;
  const loading = dadosAtividade.loading || dadosDisciplinas.loading;
  const erro = dadosAtividade.erro || dadosDisciplinas.erro;

  function recarregar() {
    dadosAtividade.recarregar();
    dadosDisciplinas.recarregar();
  }

  async function handleSalvar(valores: ValoresAtividade) {
    try {
      await atualizarAtividade(id, {
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

    Alert.alert('Atividade atualizada', 'As alterações foram salvas.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  async function handleExcluir() {
    try {
      await excluirAtividade(id);
    } catch (e) {
      Alert.alert('Não foi possível excluir', getErrorMessage(e));
      return;
    }

    Alert.alert('Atividade excluída', 'Ela foi removida da sua lista.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir atividade?',
      'Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleExcluir },
      ]
    );
  }

  if (loading) {
    return <LoadingState message="Carregando atividade..." />;
  }

  if (erro || !atividade) {
    return (
      <View style={styles.erro}>
        <FeedbackMessage type="error" text={erro || 'Atividade não encontrada.'} />
        <Button title="Tentar novamente" variant="outline" onPress={recarregar} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={confirmarExclusao} hitSlop={8}>
              <Text style={styles.excluir}>Excluir</Text>
            </Pressable>
          ),
        }}
      />
      <AtividadeForm
        disciplinas={disciplinas}
        initial={{
          disciplina_id: atividade.disciplina_id,
          titulo: atividade.titulo,
          descricao: atividade.descricao ?? '',
          tipo: atividade.tipo,
          prioridade: atividade.prioridade,
          status: atividade.status,
          data_entrega: atividade.data_entrega,
        }}
        submitLabel="Salvar alterações"
        onSubmit={handleSalvar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  erro: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  excluir: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FF9B9B',
  },
});