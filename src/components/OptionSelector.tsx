import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Opcao<T extends string> = {
  value: T;
  label: string;
  color?: string;
};

type Props<T extends string> = {
  label?: string;
  options: Opcao<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
};

export function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: Props<T>) {
  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.opcoes}>
        {options.map((opcao) => {
          const selecionada = opcao.value === value;
          return (
            <Pressable
              key={opcao.value}
              onPress={() => onChange(opcao.value)}
              style={[styles.chip, selecionada && styles.chipSelecionado]}
            >
              {!!opcao.color && (
                <View style={[styles.ponto, { backgroundColor: opcao.color }]} />
              )}
              <Text style={[styles.texto, selecionada && styles.textoSelecionado]}>
                {opcao.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  chipSelecionado: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  ponto: {
    width: 10,
    height: 10,
    marginRight: spacing.xs,
    borderRadius: 5,
  },
  texto: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  textoSelecionado: {
    color: colors.surface,
    fontWeight: '600',
  },
  error: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});