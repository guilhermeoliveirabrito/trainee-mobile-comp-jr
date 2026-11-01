import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, !!error && styles.inputError, style]}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});