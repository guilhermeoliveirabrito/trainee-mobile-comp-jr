import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { Disciplina } from '../types/disciplina';

type Props = {
  disciplina: Disciplina;
};

export function DisciplinaCard({ disciplina }: Props) {
  const detalhes = [disciplina.professor, disciplina.semestre]
    .filter(Boolean)
    .join(' • ');

  return (
    <View style={styles.card}>
      <View style={[styles.marca, { backgroundColor: disciplina.cor }]} />
      <View style={styles.texto}>
        <Text style={styles.nome}>{disciplina.nome}</Text>
        {!!detalhes && <Text style={styles.detalhes}>{detalhes}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  marca: {
    width: 8,
  },
  texto: {
    flex: 1,
    padding: spacing.md,
  },
  nome: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  detalhes: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});