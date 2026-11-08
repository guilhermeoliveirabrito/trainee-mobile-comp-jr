import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { DisciplinaCard } from '../components/DisciplinaCard';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { FloatingButton } from '../components/FloatingButton';
import { GridItem } from '../components/GridItem';
import { LoadingState } from '../components/LoadingState';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { useLayoutResponsivo } from '../hooks/useLayoutResponsivo';
import { urlDaFoto } from '../services/fotos';
import { colors, spacing } from '../styles/theme';

export function DisciplinasScreen() {
  const { disciplinas, loading, refreshing, erro, recarregar } = useDisciplinas();
  const { colunas } = useLayoutResponsivo();

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

      {/* O key força o FlatList a recriar quando muda o número de colunas */}
      <FlatList
        key={colunas}
        data={disciplinas}
        numColumns={colunas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GridItem colunas={colunas}>
            <DisciplinaCard
              disciplina={item}
              fotoUrl={urlDaFoto(item.foto_path)}
              onPress={() =>
                router.push({ pathname: '/disciplina/[id]', params: { id: item.id } })
              }
            />
          </GridItem>
        )}
        contentContainerStyle={[
          styles.lista,
          colunas > 1 && styles.listaColunas,
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

      <FloatingButton onPress={abrirCadastro} accessibilityLabel="Adicionar disciplina" />
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
  // Tira o espaço que o GridItem já coloca dos lados
  listaColunas: {
    paddingHorizontal: spacing.lg - spacing.sm,
  },
  listaVazia: {
    flexGrow: 1,
  },
});