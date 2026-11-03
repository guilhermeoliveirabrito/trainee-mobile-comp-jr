import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { DisciplinaCard } from '../components/DisciplinaCard';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { colors, spacing } from '../styles/theme';

export function DisciplinasScreen() {
  const { disciplinas, loading, refreshing, erro, recarregar } = useDisciplinas();
  const insets = useSafeAreaInsets();

  function abrirCadastro() {
    router.push('/disciplina/nova');
  }

  if (loading) {
    return <LoadingState message="Carregando disciplinas..." />;
  }

  return (
    <View style={styles.container}>
      {!!erro && (
        <View style={styles.erro}>
          <FeedbackMessage type="error" text={erro} />
          <Button title="Tentar novamente" variant="outline" onPress={recarregar} />
        </View>
      )}

      <FlatList
        data={disciplinas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DisciplinaCard disciplina={item} />}
        contentContainerStyle={[
          styles.lista,
          disciplinas.length === 0 && styles.listaVazia,
        ]}
        refreshing={refreshing}
        onRefresh={recarregar}
        ListEmptyComponent={
          erro ? undefined : (
            <EmptyState
              title="Nenhuma disciplina por aqui"
              description="Cadastre sua primeira disciplina para começar a organizar seus estudos."
              actionLabel="Cadastrar disciplina"
              onAction={abrirCadastro}
            />
          )
        }
      />

      <Pressable
        onPress={abrirCadastro}
        accessibilityLabel="Adicionar disciplina"
        style={[styles.botao, { bottom: spacing.lg + insets.bottom }]}
      >
        <Text style={styles.botaoTexto}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  erro: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  lista: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  listaVazia: {
    flexGrow: 1,
  },
  botao: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  botaoTexto: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.surface,
  },
});