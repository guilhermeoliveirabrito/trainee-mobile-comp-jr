import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <Text style={[styles.label, variant === 'outline' && styles.labelOutline]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  label: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  labelOutline: {
    color: colors.primary,
  },
  dimmed: {
    opacity: 0.6,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger },
});