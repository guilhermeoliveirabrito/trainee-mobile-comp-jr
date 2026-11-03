import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { DisciplinaForm, ValoresDisciplina } from '../components/DisciplinaForm';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { useDisciplina } from '../hooks/useDisciplina';
import { atualizarDisciplina, excluirDisciplina } from '../services/disciplinas';
import { colors, fontSize, spacing } from '../styles/theme';
import { getErrorMessage } from '../utils/errorMessages';

export function EditarDisciplinaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { disciplina, loading, erro, recarregar } = useDisciplina(id);

  async function handleSalvar(valores: ValoresDisciplina) {
    try {
      await atualizarDisciplina(id, {
        nome: valores.nome.trim(),
        professor: valores.professor.trim() || null,
        semestre: valores.semestre.trim() || null,
        cor: valores.cor,
      });
    } catch (e) {
      return getErrorMessage(e);
    }

    Alert.alert('Disciplina atualizada', 'As alterações foram salvas.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  async function handleExcluir() {
    try {
      await excluirDisciplina(id);
    } catch (e) {
      Alert.alert('Não foi possível excluir', getErrorMessage(e));
      return;
    }

    Alert.alert('Disciplina excluída', 'Ela foi removida da sua lista.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir disciplina?',
      'Todas as atividades e sessões de estudo dessa disciplina também serão excluídas. Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleExcluir },
      ]
    );
  }

  if (loading) {
    return <LoadingState message="Carregando disciplina..." />;
  }

  if (erro || !disciplina) {
    return (
      <View style={styles.erro}>
        <FeedbackMessage type="error" text={erro || 'Disciplina não encontrada.'} />
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
      <DisciplinaForm
        initial={{
          nome: disciplina.nome,
          professor: disciplina.professor ?? '',
          semestre: disciplina.semestre ?? '',
          cor: disciplina.cor,
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