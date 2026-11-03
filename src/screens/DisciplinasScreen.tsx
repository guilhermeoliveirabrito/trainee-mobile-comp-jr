import { FlatList, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { DisciplinaCard } from '../components/DisciplinaCard';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { colors, spacing } from '../styles/theme';

export function DisciplinasScreen() {
  const { disciplinas, loading, refreshing, erro, recarregar } = useDisciplinas();

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
              description="Quando você cadastrar suas disciplinas, elas aparecem nesta lista."
            />
          )
        }
      />
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
  },
  listaVazia: {
    flexGrow: 1,
  },
});