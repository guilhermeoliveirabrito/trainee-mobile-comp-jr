import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AtividadeCard } from '../components/AtividadeCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { OptionSelector } from '../components/OptionSelector';
import { STATUS } from '../constants/atividade';
import { useAtividades } from '../hooks/useAtividades';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { StatusAtividade } from '../types/atividade';

type Filtro = 'todas' | StatusAtividade;

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  ...STATUS,
];

export function AtividadesScreen() {
  const { atividades, loading, refreshing, erro, recarregar } = useAtividades();
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');

  function abrirCadastro() {
    router.push('/atividade/nova');
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
        renderItem={({ item }) => <AtividadeCard atividade={item} />}
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

      <Pressable
        onPress={abrirCadastro}
        accessibilityLabel="Adicionar atividade"
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