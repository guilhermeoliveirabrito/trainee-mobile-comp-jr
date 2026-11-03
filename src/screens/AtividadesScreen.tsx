import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { AtividadeCard } from '../components/AtividadeCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { FloatingButton } from '../components/FloatingButton';
import { LoadingState } from '../components/LoadingState';
import { OptionSelector } from '../components/OptionSelector';
import { STATUS } from '../constants/atividade';
import { useAtividades } from '../hooks/useAtividades';
import { atualizarStatusAtividade } from '../services/atividades';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { Atividade, StatusAtividade } from '../types/atividade';
import { getErrorMessage } from '../utils/errorMessages';

type Filtro = 'todas' | StatusAtividade;

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  ...STATUS,
];

export function AtividadesScreen() {
  const { atividades, loading, refreshing, erro, recarregar } = useAtividades();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');

  function abrirCadastro() {
    router.push('/atividade/nova');
  }

  async function alternarConclusao(atividade: Atividade) {
    const novoStatus: StatusAtividade =
      atividade.status === 'concluida' ? 'pendente' : 'concluida';

    try {
      await atualizarStatusAtividade(atividade.id, novoStatus);
    } catch (e) {
      Alert.alert('Não foi possível atualizar', getErrorMessage(e));
      return;
    }

    await recarregar();
  }

  if (loading) {
    return <LoadingState message="Carregando atividades..." />;
  }

  const termo = busca.trim().toLowerCase();
  const filtradas = atividades.filter(
    (atividade) =>
      (filtro === 'todas' || atividade.status === filtro) &&
      atividade.titulo.toLowerCase().includes(termo)
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por título"
          placeholderTextColor={colors.textMuted}
          style={styles.busca}
        />
        <OptionSelector options={FILTROS} value={filtro} onChange={setFiltro} />
      </View>

      {!!erro && (
        <View style={styles.erro}>
          <FeedbackMessage type="error" text={erro} />
          <Button title="Tentar novamente" variant="outline" onPress={recarregar} />
        </View>
      )}

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AtividadeCard
            atividade={item}
            onPress={() =>
              router.push({ pathname: '/atividade/[id]', params: { id: item.id } })
            }
            onToggle={() => alternarConclusao(item)}
          />
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.lista, filtradas.length === 0 && styles.listaVazia]}
        refreshing={refreshing}
        onRefresh={recarregar}
        ListEmptyComponent={
          erro ? undefined : atividades.length === 0 ? (
            <EmptyState
              title="Nenhuma atividade por aqui"
              description="Cadastre sua primeira atividade para acompanhar suas entregas."
              actionLabel="Cadastrar atividade"
              onAction={abrirCadastro}
            />
          ) : (
            <EmptyState
              title="Nenhum resultado"
              description="Tente outro filtro ou outra busca."
            />
          )
        }
      />

      <FloatingButton onPress={abrirCadastro} accessibilityLabel="Adicionar atividade" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtros: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  busca: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    fontSize: fontSize.md,
    color: colors.text,
  },
  erro: {
    paddingHorizontal: spacing.lg,
  },
  lista: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: 100,
  },
  listaVazia: {
    flexGrow: 1,
  },
});