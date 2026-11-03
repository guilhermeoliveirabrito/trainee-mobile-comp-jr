import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = {
  label: string;
  value: number;
  color?: string;
  width: `${number}%`;
};

export function StatCard({ label, value, color = colors.primary, width }: Props) {
  return (
    <View style={[styles.card, { width }]}>
      <Text style={[styles.valor, { color }]}>{value}</Text>
      <Text style={styles.rotulo}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  valor: {
    fontSize: fontSize.title,
    fontWeight: '700',
  },
  rotulo: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});