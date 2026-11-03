import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AtividadeCard } from '../components/AtividadeCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { useAtividades } from '../hooks/useAtividades';
import { colors, fontSize, spacing } from '../styles/theme';
import { hojeIso } from '../utils/datas';

const LARGURA_TABLET = 768;

export function InicioScreen() {
  const { session } = useAuth();
  const { atividades, loading, refreshing, erro, recarregar } = useAtividades();
  const { width } = useWindowDimensions();

  const larguraCard = width >= LARGURA_TABLET ? '23.5%' : '48%';
  const nomeCompleto = session?.user.user_metadata?.nome as string | undefined;
  const primeiroNome = nomeCompleto?.trim().split(' ')[0];

  if (loading) {
    return <LoadingState message="Carregando seu painel..." />;
  }

  const hoje = hojeIso();
  const pendentes = atividades.filter((a) => a.status === 'pendente').length;
  const emAndamento = atividades.filter((a) => a.status === 'em_andamento').length;
  const concluidas = atividades.filter((a) => a.status === 'concluida').length;
  const atrasadas = atividades.filter(
    (a) => a.status !== 'concluida' && !!a.data_entrega && a.data_entrega < hoje
  ).length;
  const proximas = atividades
    .filter((a) => a.status !== 'concluida' && !!a.data_entrega)
    .slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={recarregar} />}
    >
      <View style={styles.coluna}>
        <Text style={styles.saudacao}>
          {primeiroNome ? `Olá, ${primeiroNome}!` : 'Olá!'}
        </Text>
        <Text style={styles.subtitulo}>Veja como estão seus estudos.</Text>

        {!!erro && (
          <View style={styles.erro}>
            <FeedbackMessage type="error" text={erro} />
            <Button title="Tentar novamente" variant="outline" onPress={recarregar} />
          </View>
        )}

        <View style={styles.contadores}>
          <StatCard label="Pendentes" value={pendentes} width={larguraCard} />
          <StatCard label="Em andamento" value={emAndamento} width={larguraCard} />
          <StatCard
            label="Atrasadas"
            value={atrasadas}
            color={colors.danger}
            width={larguraCard}
          />
          <StatCard
            label="Concluídas"
            value={concluidas}
            color={colors.success}
            width={larguraCard}
          />
        </View>

        <View style={styles.cabecalhoLista}>
          <Text style={styles.tituloLista}>Próximas entregas</Text>
          {atividades.length > 0 && (
            <Text style={styles.verTodas} onPress={() => router.push('/atividades')}>
              Ver todas
            </Text>
          )}
        </View>

        {proximas.length > 0 ? (
          proximas.map((atividade) => (
            <AtividadeCard
              key={atividade.id}
              atividade={atividade}
              onPress={() =>
                router.push({ pathname: '/atividade/[id]', params: { id: atividade.id } })
              }
            />
          ))
        ) : (
          <View style={styles.vazio}>
            <EmptyState
              title={
                atividades.length === 0
                  ? 'Nenhuma atividade ainda'
                  : 'Nenhuma entrega à vista'
              }
              description={
                atividades.length === 0
                  ? 'Cadastre sua primeira atividade para acompanhar suas entregas.'
                  : 'As atividades com data de entrega que não estão concluídas aparecem aqui.'
              }
              actionLabel={atividades.length === 0 ? 'Cadastrar atividade' : undefined}
              onAction={
                atividades.length === 0 ? () => router.push('/atividade/nova') : undefined
              }
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  coluna: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  saudacao: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitulo: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  erro: {
    marginBottom: spacing.md,
  },
  contadores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    marginBottom: spacing.lg,
  },
  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  tituloLista: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  verTodas: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.accent,
  },
  vazio: {
    minHeight: 220,
  },
});