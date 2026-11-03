import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PRIORIDADES, rotulo, STATUS, TIPOS } from '../constants/atividade';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { Atividade } from '../types/atividade';
import { formatarData, hojeIso } from '../utils/datas';

type Props = {
  atividade: Atividade;
  onPress?: () => void;
};

export function AtividadeCard({ atividade, onPress }: Props) {
  const concluida = atividade.status === 'concluida';
  const atrasada =
    !concluida && !!atividade.data_entrega && atividade.data_entrega < hojeIso();
  const disciplina = atividade.disciplinas;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
    >
      <View style={styles.topo}>
        <Text style={[styles.titulo, concluida && styles.concluida]} numberOfLines={2}>
          {atividade.titulo}
        </Text>
        <Text style={styles.status}>{rotulo(STATUS, atividade.status)}</Text>
      </View>

      {!!disciplina && (
        <View style={styles.disciplina}>
          <View style={[styles.ponto, { backgroundColor: disciplina.cor }]} />
          <Text style={styles.disciplinaNome}>{disciplina.nome}</Text>
        </View>
      )}

      <Text style={styles.detalhes}>
        {rotulo(TIPOS, atividade.tipo)} • Prioridade{' '}
        {rotulo(PRIORIDADES, atividade.prioridade).toLowerCase()}
      </Text>

      {!!atividade.data_entrega && (
        <Text style={[styles.data, atrasada && styles.atrasada]}>
          {atrasada ? 'Atrasada • ' : 'Entrega: '}
          {formatarData(atividade.data_entrega)}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  pressionado: {
    opacity: 0.7,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titulo: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  concluida: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  status: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.accent,
  },
  disciplina: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ponto: {
    width: 10,
    height: 10,
    marginRight: spacing.xs,
    borderRadius: 5,
  },
  disciplinaNome: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  detalhes: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  data: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  atrasada: {
    color: colors.danger,
  },
});